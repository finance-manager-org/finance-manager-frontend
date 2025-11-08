import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Bell, DollarSign, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import React from "react";

// Datos de ejemplo de pagos programados
const scheduledPayments = [
  { id: 1, title: "Renta", amount: 1200, date: new Date(2025, 10, 15), category: "Servicios", recurring: "monthly" },
  { id: 2, title: "Netflix", amount: 12.99, date: new Date(2025, 10, 10), category: "Entretenimiento", recurring: "monthly" },
  { id: 3, title: "Seguro Auto", amount: 150, date: new Date(2025, 10, 20), category: "Seguros", recurring: "monthly" },
  { id: 4, title: "Internet", amount: 45, date: new Date(2025, 10, 5), category: "Servicios", recurring: "monthly" },
  { id: 5, title: "Gym", amount: 30, date: new Date(2025, 10, 1), category: "Salud", recurring: "monthly" },
];

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [payments, setPayments] = useState(scheduledPayments);
  const [isOpen, setIsOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    title: "",
    amount: "",
    date: new Date(),
    category: "",
    recurring: "once"
  });

  const handleAddPayment = () => {
    const payment = {
      id: payments.length + 1,
      title: newPayment.title,
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
      category: newPayment.category,
      recurring: newPayment.recurring
    };
    setPayments([...payments, payment]);
    setIsOpen(false);
    setNewPayment({
      title: "",
      amount: "",
      date: new Date(),
      category: "",
      recurring: "once"
    });
  };

  const handleDeletePayment = (id: number) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  // Obtener pagos del mes seleccionado
  const selectedMonth = date?.getMonth() ?? new Date().getMonth();
  const selectedYear = date?.getFullYear() ?? new Date().getFullYear();
  const monthPayments = payments.filter(p => 
    p.date.getMonth() === selectedMonth && p.date.getFullYear() === selectedYear
  );

  // Calcular total de pagos del mes
  const totalPayments = monthPayments.reduce((sum, p) => sum + p.amount, 0);

  // Obtener próximos pagos (siguientes 7 días)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingPayments = payments
    .filter(p => p.date >= today && p.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 mb-2">Calendario de Pagos</h1>
              <p className="text-slate-600">Programa y gestiona tus pagos importantes</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Pago
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Programar Nuevo Pago</DialogTitle>
                  <DialogDescription>
                    Agrega un pago programado para no olvidar fechas importantes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nombre del pago</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Renta, Netflix, Seguro..."
                      value={newPayment.title}
                      onChange={(e) => setNewPayment({...newPayment, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newPayment.category}
                      onValueChange={(value) => setNewPayment({...newPayment, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Servicios">Servicios</SelectItem>
                        <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                        <SelectItem value="Seguros">Seguros</SelectItem>
                        <SelectItem value="Salud">Salud</SelectItem>
                        <SelectItem value="Educación">Educación</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurring">Frecuencia</Label>
                    <Select
                      value={newPayment.recurring}
                      onValueChange={(value) => setNewPayment({...newPayment, recurring: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Una vez</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddPayment} className="w-full">
                  Agregar Pago
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">Total del Mes</CardTitle>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">${totalPayments.toFixed(2)}</div>
                <p className="text-xs text-slate-500">{monthPayments.length} pagos programados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">Próximos 7 Días</CardTitle>
                <Bell className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">{upcomingPayments.length} pagos</div>
                <p className="text-xs text-slate-500">
                  ${upcomingPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">Pagos Recurrentes</CardTitle>
                <CalendarIcon className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">
                  {payments.filter(p => p.recurring !== "once").length} activos
                </div>
                <p className="text-xs text-slate-500">Automatizados mensualmente</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-900">Calendario</CardTitle>
                <CardDescription>Visualiza tus pagos programados</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    payment: monthPayments.map(p => p.date)
                  }}
                  modifiersStyles={{
                    payment: {
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontWeight: "bold"
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Próximos Pagos</CardTitle>
                <CardDescription>Siguientes 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingPayments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No hay pagos programados
                    </p>
                  ) : (
                    upcomingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-3 bg-slate-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-slate-900">{payment.title}</div>
                            <div className="text-xs text-slate-500">
                              {payment.date.toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-slate-900">
                            ${payment.amount.toFixed(2)}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {payment.category}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Payments List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Todos los Pagos Programados</CardTitle>
              <CardDescription>Gestiona tus pagos recurrentes y únicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-slate-900">{payment.title}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span>{payment.category}</span>
                          <span>•</span>
                          <span>
                            {payment.date.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-slate-900">${payment.amount.toFixed(2)}</div>
                        <Badge variant="outline" className="text-xs">
                          {payment.recurring === "monthly" ? "Mensual" : 
                           payment.recurring === "yearly" ? "Anual" : "Una vez"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
