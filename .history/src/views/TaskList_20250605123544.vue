import { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ClientesOrdenes from "./ClientesOrdenes";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { format, parseISO } from "date-fns";
import { carteraDataBase } from "../../utils/carteraData";
import EstadoCarteraGrafico from "../dashboard/CarteraDashboard";
import ResumenFinanciero from "../dashboard/ResumenFinanciero";
import VentasMensuales from "../dashboard/VentasMensuales";

const fetchReporteAPI = async (estado, fechaInicio, fechaFin) => {
  let url = `http://localhost:5000/api/reportes?`;
  if (estado && estado !== "Todos") url += `estado=${estado}&`;
  if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
  if (fechaFin) url += `fechaFin=${fechaFin}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener reportes");
  const data = await response.json();

  return data.map(item => ({
    id: item.id,
    cliente_id: item.cliente_id,
    cliente: item.cliente,
    monto: parseFloat(item.monto),
    estado: item.estado,
    fecha: item.fecha,
    fecha_caducidad: item.fecha_caducidad,
  }));
};

export default function ReportePanel() {
  const estados = ["Todos", "Sana", "Media", "Castigada"];
  const [descargando, setDescargando] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const [estado, setEstado] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("2025-04-01");
  const [fechaFin, setFechaFin] = useState("2025-05-31");

  const [carteraData, setCarteraData] = useState(carteraDataBase);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [clientesConOrdenes, setClientesConOrdenes] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);

  // Responsive confetti
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function cargarVentasMensuales() {
      setCargando(true);
      try {
        const res = await fetch("http://localhost:5000/api/reportes/ventas_mensuales");
        if (!res.ok) throw new Error("Error al cargar ventas mensuales");
        const data = await res.json();
        setVentasMensuales(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setCargando(false);
      }
    }
    cargarVentasMensuales();
  }, []);

  useEffect(() => {
    async function cargarClientesConOrdenes() {
      try {
        const res = await fetch("http://localhost:5000/api/clientes_con_ordenes");
        if (!res.ok) throw new Error("Error al cargar clientes con órdenes");
        const data = await res.json();
        setClientesConOrdenes(data);
      } catch (error) {
        toast.error(error.message);
      }
    }
    cargarClientesConOrdenes();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setCargando(true);
        const data = await fetchReporteAPI(estado, fechaInicio, fechaFin);
        setReportes(data);

        const totals = { Sana: 0, Media: 0, Castigada: 0 };
        data.forEach(i => {
          if (totals[i.estado] !== undefined) totals[i.estado]++;
        });
        const total = data.length || 1;
        setCarteraData([
          { name: "Sana", value: Math.round((totals.Sana / total) * 100), color: "#22c55e" },
          { name: "Media", value: Math.round((totals.Media / total) * 100), color: "#fbbf24" },
          { name: "Castigada", value: Math.round((totals.Castigada / total) * 100), color: "#ef4444" },
        ]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setCargando(false);
      }
    }
    load();
  }, [estado, fechaInicio, fechaFin]);

  // --------- FILTRO CONSISTENTE DE CLIENTES Y ÓRDENES ---------
  function getClientesOrdenesFiltrados() {
    return clientesConOrdenes
      .map(cliente => {
        // Filtra las órdenes según estado y rango de fechas
        const ordenesFiltradas = (cliente.ordenes || []).filter(orden => {
          if (estado !== "Todos" && orden.estado !== estado) return false;
          if (fechaInicio && orden.fecha && orden.fecha < fechaInicio) return false;
          if (fechaFin && orden.fecha && orden.fecha > fechaFin) return false;
          return true;
        });
        return { ...cliente, ordenes: ordenesFiltradas };
      })
      .filter(cliente => cliente.ordenes && cliente.ordenes.length > 0);
  }

  // -------- EXPORTACIÓN PDF CLIENTES Y ÓRDENES --------
  const exportarClientesOrdenesPDF = () => {
    const filtrados = getClientesOrdenesFiltrados();
    if (filtrados.length === 0) {
      toast.error("No hay datos para exportar con los filtros seleccionados");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.text("Clientes y Órdenes - Imporisel S.A.S.", 40, 40);
    doc.setFontSize(10);
    doc.text(`Generado: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 40, 58);
    doc.text(`Filtros: Estado = ${estado}, Periodo = ${fechaInicio} a ${fechaFin}`, 40, 74);

    // Genera tabla
    let tablaFinal = [];
    filtrados.forEach(cliente => {
      cliente.ordenes.forEach(orden => {
        if (orden.productos && orden.productos.length > 0) {
          orden.productos.forEach(producto => {
            tablaFinal.push([
              cliente.nombre || cliente.razon_social || "-",
              cliente.ruc || cliente.documento || "-",
              orden.id || "-",
              orden.fecha ? format(parseISO(orden.fecha), "dd/MM/yyyy") : "-",
              producto.nombre || "-",
              producto.cantidad || "-",
              producto.precio ? `$${producto.precio.toFixed(2)}` : "-",
              producto.total ? `$${producto.total.toFixed(2)}` : `$${(producto.precio * producto.cantidad).toFixed(2)}`,
              orden.estado || "-"
            ]);
          });
        } else {
          tablaFinal.push([
            cliente.nombre || cliente.razon_social || "-",
            cliente.ruc || cliente.documento || "-",
            orden.id || "-",
            orden.fecha ? format(parseISO(orden.fecha), "dd/MM/yyyy") : "-",
            "-", "-", "-", "-", orden.estado || "-"
          ]);
        }
      });
    });

    autoTable(doc, {
      startY: 90,
      head: [[
        "Cliente", "Documento/RUC", "ID Orden", "Fecha Orden",
        "Producto", "Cantidad", "Precio", "Subtotal", "Estado Orden"
      ]],
      body: tablaFinal,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 75 },
        2: { cellWidth: 48 },
        3: { cellWidth: 65 },
        4: { cellWidth: 110 },
        5: { cellWidth: 38 },
        6: { cellWidth: 50 },
        7: { cellWidth: 50 },
        8: { cellWidth: 60 }
      },
      margin: { left: 40, right: 40 }
    });

    doc.save(`Clientes_Ordenes_${fechaInicio}_a_${fechaFin}.pdf`);
    setConfetti(true);
    toast.success("Clientes y órdenes exportados en PDF 🚀");
    setTimeout(() => setConfetti(false), 2000);
  };

  // -------- EXPORTACIÓN EXCEL CLIENTES Y ÓRDENES --------
  const exportarClientesOrdenesExcel = () => {
    const filtrados = getClientesOrdenesFiltrados();
    if (filtrados.length === 0) {
      toast.error("No hay datos para exportar con los filtros seleccionados");
      return;
    }

    let dataExcel = [];
    filtrados.forEach(cliente => {
      cliente.ordenes.forEach(orden => {
        if (orden.productos && orden.productos.length > 0) {
          orden.productos.forEach(producto => {
            dataExcel.push({
              "Cliente": cliente.nombre || cliente.razon_social || "-",
              "Documento/RUC": cliente.ruc || cliente.documento || "-",
              "ID Orden": orden.id || "-",
              "Fecha Orden": orden.fecha ? format(parseISO(orden.fecha), "dd/MM/yyyy") : "-",
              "Producto": producto.nombre || "-",
              "Cantidad": producto.cantidad || "-",
              "Precio": producto.precio ? producto.precio : "-",
              "Subtotal": producto.total ? producto.total : (producto.precio * producto.cantidad) || "-",
              "Estado Orden": orden.estado || "-"
            });
          });
        } else {
          dataExcel.push({
            "Cliente": cliente.nombre || cliente.razon_social || "-",
            "Documento/RUC": cliente.ruc || cliente.documento || "-",
            "ID Orden": orden.id || "-",
            "Fecha Orden": orden.fecha ? format(parseISO(orden.fecha), "dd/MM/yyyy") : "-",
            "Producto": "-",
            "Cantidad": "-",
            "Precio": "-",
            "Subtotal": "-",
            "Estado Orden": orden.estado || "-"
          });
        }
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes_Ordenes");

    const fechaHoy = format(new Date(), "yyyyMMdd_HHmmss");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Clientes_Ordenes_${fechaInicio}_a_${fechaFin}_${fechaHoy}.xlsx`);
    toast.success("Clientes y órdenes exportados en Excel 🟩");
  };

  // ----------- FIN EXPORTACIÓN -----------

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-tr from-gray-50 via-white to-gray-100 min-h-screen px-2 py-4 sm:p-4 md:p-6">
      {confetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} />}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reportes Financieros</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Filtra y exporta análisis de cartera y proyecciones financieras
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 border border-gray-100 mb-8 flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" />
            <span className="font-semibold text-gray-700">Filtros:</span>
          </div>
          <select
            className="border border-gray-300 rounded px-2 py-2 mr-2 focus:outline-none text-sm"
            value={estado}
            onChange={e => setEstado(e.target.value)}
          >
            {estados.map(est => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>
          <span className="text-sm">Desde:</span>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            max={fechaFin}
          />
          <span className="text-sm">Hasta:</span>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            min={fechaInicio}
          />
        </div>

        {/* Gráficos y resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Estado de Cartera */}
          <div className="lg:col-span-1">
            <EstadoCarteraGrafico />
          </div>
          {/* Ventas Mensuales */}
          <div className="lg:col-span-1">
            <VentasMensuales ventasMensuales={ventasMensuales} />
          </div>
          {/* Resumen Financiero */}
          <div className="lg:col-span-1">
            <ResumenFinanciero clientesConOrdenes={getClientesOrdenesFiltrados()} />
          </div>
        </div>

        {/* Exportar Clientes y Órdenes */}
        <div className="flex flex-col sm:flex-row sm:justify-end mb-2 mt-8 gap-3">
          <button
            onClick={exportarClientesOrdenesPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center hover:bg-green-700 transition text-sm w-full sm:w-auto"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar Clientes y Órdenes (PDF)
          </button>
          <button
            onClick={exportarClientesOrdenesExcel}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold flex items-center hover:bg-yellow-600 transition text-sm w-full sm:w-auto"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar Clientes y Órdenes (Excel)
          </button>
        </div>

        {/* Listado de clientes y órdenes */}
        <div className="overflow-x-auto rounded-xl bg-white shadow mt-2">
          <ClientesOrdenes clientesConOrdenes={getClientesOrdenesFiltrados()} />
        </div>
      </div>
    </div>
  );
}
