import { DashboardLayout } from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useRedirect from "../basicFuntions/funtions";
import React from "react";

// Datos de ejemplo
const monthlyData = [
  { name: "Ene", ingresos: 4000, gastos: 2400 },
  { name: "Feb", ingresos: 3000, gastos: 1398 },
  { name: "Mar", ingresos: 2000, gastos: 3800 },
  { name: "Abr", ingresos: 2780, gastos: 3908 },
  { name: "May", ingresos: 1890, gastos: 4800 },
  { name: "Jun", ingresos: 2390, gastos: 3800 },
];

const categoryData = [
  { name: "Alimentación", value: 400, color: "#3b82f6" },
  { name: "Transporte", value: 300, color: "#8b5cf6" },
  { name: "Entretenimiento", value: 200, color: "#ec4899" },
  { name: "Servicios", value: 278, color: "#f59e0b" },
  { name: "Otros", value: 189, color: "#10b981" },
];

const recentTransactions = [
  {
    id: 1,
    description: "Supermercado",
    category: "Alimentación",
    amount: -85.5,
    date: "2025-11-08",
    type: "expense",
  },
  {
    id: 2,
    description: "Salario",
    category: "Ingreso",
    amount: 3500,
    date: "2025-11-05",
    type: "income",
  },
  {
    id: 3,
    description: "Netflix",
    category: "Entretenimiento",
    amount: -12.99,
    date: "2025-11-04",
    type: "expense",
  },
  {
    id: 4,
    description: "Gasolina",
    category: "Transporte",
    amount: -45.0,
    date: "2025-11-03",
    type: "expense",
  },
  {
    id: 5,
    description: "Freelance",
    category: "Ingreso",
    amount: 500,
    date: "2025-11-02",
    type: "income",
  },
];

const stats = [
  {
    title: "Balance Total",
    value: "$12,450.00",
    change: "+12.5%",
    trend: "up",
    icon: Wallet,
    color: "blue",
  },
  {
    title: "Ingresos del Mes",
    value: "$4,230.00",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    color: "green",
  },
  {
    title: "Gastos del Mes",
    value: "$2,890.00",
    change: "-3.1%",
    trend: "down",
    icon: TrendingDown,
    color: "red",
  },
  {
    title: "Ahorro",
    value: "$1,340.00",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
    color: "indigo",
  },
];

export function DashboardPage() {
  console.log("📊 [DashboardPage] Componente montado");
  const { goToHome } = useRedirect();
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
          <div>
            <h1 className="text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              Bienvenido de nuevo, aquí está tu resumen financiero
            </p>
            <button
              onClick={goToHome}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to home
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-900 mb-1">{stat.value}</div>
                    <div className="flex items-center gap-3 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {stat.change}
                      </span>
                      <span className="text-slate-500">vs mes anterior</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart - Ingresos vs Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">
                  Ingresos vs Gastos
                </CardTitle>
                <CardDescription>
                  Comparación mensual de los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ingresos"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="gastos"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Gastos por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">
                  Gastos por Categoría
                </CardTitle>
                <CardDescription>
                  Distribución de gastos este mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">
                Transacciones Recientes
              </CardTitle>
              <CardDescription>
                Últimos movimientos en tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-slate-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-slate-500">
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                ))}{" "}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
