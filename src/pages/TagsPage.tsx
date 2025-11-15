import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag as TagIcon, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { tagApi, accountApi, Tag, Account } from "../lib/api";
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

const TAG_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-green-100 text-green-700 border-green-300",
  "bg-purple-100 text-purple-700 border-purple-300",
  "bg-amber-100 text-amber-700 border-amber-300",
  "bg-rose-100 text-rose-700 border-rose-300",
  "bg-cyan-100 text-cyan-700 border-cyan-300",
  "bg-indigo-100 text-indigo-700 border-indigo-300",
  "bg-pink-100 text-pink-700 border-pink-300",
];

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccount, setFilterAccount] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accountId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    accountId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tagsData, accountsData, profileData] = await Promise.all([
        tagApi.getAll(),
        tagApi.getAll().then(() => accountApi.getAll(1)), // Temporal: usar ID real del usuario
        fetch("/api/auth/profile", { credentials: "include" }).then((r) =>
          r.json()
        ),
      ]);

      // Obtener cuentas del usuario actual
      if (profileData.user) {
        const userAccounts = await accountApi.getAll(profileData.user.id);
        setAccounts(userAccounts);
      }

      setTags(tagsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const getColorForTag = (index: number) => {
    return TAG_COLORS[index % TAG_COLORS.length];
  };

  const openCreateDialog = () => {
    setEditingTag(null);
    setFormData({
      name: "",
      description: "",
      accountId: accounts[0]?.id.toString() || "",
    });
    setErrors({ name: "", accountId: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || "",
      accountId: tag.accountId.toString(),
    });
    setErrors({ name: "", accountId: "" });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (tag: Tag) => {
    setDeletingTag(tag);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      accountId: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.name.length > 50) {
      newErrors.name = "El nombre no puede exceder 50 caracteres";
    }

    if (!formData.accountId) {
      newErrors.accountId = "Debe seleccionar una cuenta";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.accountId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (editingTag) {
        // Actualizar tag existente
        const response = await tagApi.update(editingTag.id, {
          name: formData.name,
          description: formData.description || undefined,
        });
        toast.success("Tag actualizada correctamente");
      } else {
        // Crear nueva tag
        const response = await tagApi.create({
          name: formData.name,
          description: formData.description || undefined,
          accountId: Number(formData.accountId),
        });
        toast.success("Tag creada correctamente");
      }

      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Error saving tag:", error);
      toast.error(error.message || "Error al guardar la tag");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTag) return;

    try {
      await tagApi.delete(deletingTag.id);
      toast.success("Tag eliminada correctamente");
      setIsDeleteDialogOpen(false);
      setDeletingTag(null);
      loadData();
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast.error(error.message || "Error al eliminar la tag");
    }
  };

  // Filtrar tags
  const filteredTags = tags.filter((tag) => {
    const matchesSearch = tag.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAccount =
      filterAccount === "all" || tag.accountId.toString() === filterAccount;
    return matchesSearch && matchesAccount;
  });

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
          Gestión de Etiquetas
        </h1>
        <p className="text-slate-600">
          Organiza tus transacciones con etiquetas personalizadas
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar etiquetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterAccount} onValueChange={setFilterAccount}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por cuenta" />
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
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Etiqueta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Etiquetas</CardDescription>
            <CardTitle className="text-3xl">{tags.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Etiquetas con Transacciones</CardDescription>
            <CardTitle className="text-3xl">
              {tags.filter((t) => t.transactions && t.transactions.length > 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cuentas con Etiquetas</CardDescription>
            <CardTitle className="text-3xl">
              {new Set(tags.map((t) => t.accountId)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TagIcon className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-500 text-center mb-4">
              {searchQuery || filterAccount !== "all"
                ? "No se encontraron etiquetas con los filtros aplicados"
                : "No tienes etiquetas creadas aún"}
            </p>
            {!searchQuery && filterAccount === "all" && (
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Primera Etiqueta
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag, index) => (
            <Card
              key={tag.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorForTag(
                      index
                    )}`}
                  >
                    {tag.name}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(tag)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => openDeleteDialog(tag)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {tag.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {tag.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{tag.account?.name || "Cuenta desconocida"}</span>
                  <span>
                    {tag.transactions?.length || 0} transacciones
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Editar Etiqueta" : "Nueva Etiqueta"}
              </DialogTitle>
              <DialogDescription>
                {editingTag
                  ? "Modifica los datos de la etiqueta"
                  : "Crea una nueva etiqueta para organizar tus transacciones"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Comida rápida, Gasolina, etc."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe para qué usarás esta etiqueta..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {!editingTag && (
                <div className="space-y-2">
                  <Label htmlFor="accountId">
                    Cuenta <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.accountId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, accountId: value })
                    }
                  >
                    <SelectTrigger
                      className={errors.accountId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id.toString()}
                        >
                          {account.name || `Cuenta ${account.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.accountId && (
                    <p className="text-sm text-red-500">{errors.accountId}</p>
                  )}
                </div>
              )}
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
                ) : editingTag ? (
                  "Actualizar"
                ) : (
                  "Crear Etiqueta"
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
              Esta acción eliminará la etiqueta "{deletingTag?.name}". Las
              transacciones asociadas no serán eliminadas, pero perderán esta
              etiqueta.
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
