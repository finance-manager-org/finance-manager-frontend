import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  X,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { toast } from "sonner";
import {
  transactionApi,
  tagApi,
  accountApi,
  Transaction,
  Tag,
  Account,
  TransactionFilters,
} from "../lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "../components/ui/badge";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [filterAccount, setFilterAccount] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    isIncome: true,
    transactionDate: new Date(),
    description: "",
    tagId: "",
  });

  const [errors, setErrors] = useState({
    amount: "",
    transactionDate: "",
    description: "",
    tagId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, tagsData, profileData] = await Promise.all([
        transactionApi.getAll(),
        tagApi.getAll(),
        fetch("/api/auth/profile", { credentials: "include" }).then((r) =>
          r.json()
        ),
      ]);

      if (profileData.user) {
        const userAccounts = await accountApi.getAll(profileData.user.id);
        setAccounts(userAccounts);
      }

      setTransactions(transactionsData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...transactions];

    // Aplicar filtros de API
    if (filters.accountId || filters.tagId || filters.isIncome !== undefined) {
      if (filters.accountId) {
        result = result.filter(
          (t) => t.tag?.accountId === filters.accountId
        );
      }
      if (filters.tagId) {
        result = result.filter((t) => t.tagId === filters.tagId);
      }
      if (filters.isIncome !== undefined) {
        result = result.filter((t) => t.isIncome === filters.isIncome);
      }
    }

    // Búsqueda por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.tag?.name.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
      );
    }

    setFilteredTransactions(result);
  };

  const handleFilterChange = () => {
    const newFilters: TransactionFilters = {};

    if (filterAccount !== "all") {
      newFilters.accountId = Number(filterAccount);
    }
    if (filterTag !== "all") {
      newFilters.tagId = Number(filterTag);
    }
    if (filterType !== "all") {
      newFilters.isIncome = filterType === "income";
    }

    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterAccount("all");
    setFilterTag("all");
    setFilterType("all");
    setFilters({});
    setSearchQuery("");
  };

  const openCreateDialog = () => {
    setEditingTransaction(null);
    setFormData({
      amount: "",
      isIncome: true,
      transactionDate: new Date(),
      description: "",
      tagId: tags[0]?.id.toString() || "",
    });
    setErrors({ amount: "", transactionDate: "", description: "", tagId: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      isIncome: transaction.isIncome,
      transactionDate: new Date(transaction.transactionDate),
      description: transaction.description || "",
      tagId: transaction.tagId.toString(),
    });
    setErrors({ amount: "", transactionDate: "", description: "", tagId: "" });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors = {
      amount: "",
      transactionDate: "",
      description: "",
      tagId: "",
    };

    const amount = parseFloat(formData.amount);

    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = "El monto es requerido";
    } else if (amount <= 0) {
      newErrors.amount = "El monto debe ser mayor a 0";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      newErrors.amount = "El monto debe tener máximo 2 decimales";
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "La fecha es requerida";
    } else if (formData.transactionDate > new Date()) {
      newErrors.transactionDate = "La fecha no puede ser futura";
    }

    if (amount > 1000 && !formData.description.trim()) {
      newErrors.description =
        "La descripción es obligatoria para montos mayores a $1,000";
    }

    if (!formData.tagId) {
      newErrors.tagId = "Debe seleccionar una etiqueta";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const dataToSubmit = {
        amount: parseFloat(formData.amount),
        isIncome: formData.isIncome,
        transactionDate: formData.transactionDate.toISOString(),
        description: formData.description || undefined,
        tagId: Number(formData.tagId),
      };

      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, dataToSubmit);
        toast.success("Transacción actualizada correctamente");
      } else {
        await transactionApi.create(dataToSubmit);
        toast.success("Transacción creada correctamente");
      }

      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Error al guardar la transacción");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;

    try {
      await transactionApi.delete(deletingTransaction.id);
      toast.success("Transacción eliminada correctamente");
      setIsDeleteDialogOpen(false);
      setDeletingTransaction(null);
      loadData();
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message || "Error al eliminar la transacción");
    }
  };

  // Calcular estadísticas
  const stats = {
    total: filteredTransactions.length,
    income: filteredTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0),
    expense: filteredTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0),
    balance: 0,
  };
  stats.balance = stats.income - stats.expense;

  const hasActiveFilters =
    filterAccount !== "all" ||
    filterTag !== "all" ||
    filterType !== "all" ||
    searchQuery !== "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Transacciones
        </h1>
        <p className="text-slate-600">
          Gestiona todos tus ingresos y gastos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transacciones</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <ArrowUpCircle className="w-4 h-4 text-green-600" />
              Ingresos
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">
              ${stats.income.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <ArrowDownCircle className="w-4 h-4 text-red-600" />
              Gastos
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">
              ${stats.expense.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Balance</CardDescription>
            <CardTitle
              className={`text-3xl ${
                stats.balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ${stats.balance.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar por descripción, etiqueta o monto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {[filterAccount, filterTag, filterType].filter(
                    (f) => f !== "all"
                  ).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filtrar por</h4>
              
              <div className="space-y-2">
                <Label>Cuenta</Label>
                <Select value={filterAccount} onValueChange={setFilterAccount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las cuentas</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name || `Cuenta ${account.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Etiqueta</Label>
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las etiquetas</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Ingresos</SelectItem>
                    <SelectItem value="expense">Gastos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleFilterChange}
                  className="flex-1"
                  size="sm"
                >
                  Aplicar
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {hasActiveFilters ? (
              <>
                <Filter className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-center mb-4">
                  No se encontraron transacciones con los filtros aplicados
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </>
            ) : (
              <>
                <ArrowUpCircle className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-center mb-4">
                  No tienes transacciones registradas aún
                </p>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Primera Transacción
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className={`hover:shadow-md transition-shadow ${
                transaction.isIncome
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-red-500"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {transaction.isIncome ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">
                          {transaction.description || "Sin descripción"}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <Badge variant="outline">{transaction.tag?.name}</Badge>
                          <span>•</span>
                          <span>
                            {format(
                              new Date(transaction.transactionDate),
                              "dd MMM yyyy, HH:mm",
                              { locale: es }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-2xl font-bold ${
                        transaction.isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.isIncome ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(transaction)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(transaction)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={openCreateDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Editar Transacción" : "Nueva Transacción"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Modifica los datos de la transacción"
                  : "Registra un nuevo ingreso o gasto"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.isIncome ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, isIncome: true })}
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Ingreso
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.isIncome ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, isIncome: false })}
                  >
                    <ArrowDownCircle className="w-4 h-4 mr-2" />
                    Gasto
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Monto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionDate">
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.transactionDate ? "border-red-500" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.transactionDate ? (
                        format(formData.transactionDate, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.transactionDate}
                      onSelect={(date) =>
                        setFormData({
                          ...formData,
                          transactionDate: date || new Date(),
                        })
                      }
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.transactionDate && (
                  <p className="text-sm text-red-500">{errors.transactionDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagId">
                  Etiqueta <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.tagId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tagId: value })
                  }
                >
                  <SelectTrigger
                    className={errors.tagId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona una etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name} - {tag.account?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tagId && (
                  <p className="text-sm text-red-500">{errors.tagId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción
                  {parseFloat(formData.amount) > 1000 && (
                    <span className="text-red-500"> *</span>
                  )}
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe la transacción..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                {parseFloat(formData.amount) > 1000 && (
                  <p className="text-xs text-slate-500">
                    La descripción es obligatoria para montos mayores a $1,000
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : editingTransaction ? (
                  "Actualizar"
                ) : (
                  "Crear Transacción"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la transacción de $
              {deletingTransaction?.amount.toFixed(2)} y ajustará el balance de
              la cuenta automáticamente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
