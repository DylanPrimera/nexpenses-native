import { AccountDrawer } from "@/features/auth";
import {
  AppSheet,
  Button,
  ConfirmDialog,
  DatePickerField,
  CurrencyInput,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Icon,
  Input,
  Label,
  SearchListField,
  playErrorSound,
  playModalClose,
  playModalOpen,
  playPressSound,
  playSuccessSound,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  showToast,
  Skeleton,
  Switch,
  Text,
  Textarea,
} from "@/shared";
import { formatCOPCurrency } from "@/core/utils/currency";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react-native";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEMO_CATEGORIES = [
  { id: "food", name: "Comida" },
  { id: "transport", name: "Transporte" },
  { id: "home", name: "Hogar" },
  { id: "health", name: "Salud" },
  { id: "fun", name: "Ocio" },
];

export default function UiKitScreen() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  if (!__DEV__) return <Redirect href="/" />;

  const emailError = email.length > 0 && !email.includes("@") ? "Correo inválido" : undefined;

  return (
    <>
      <Stack.Screen options={{ title: "UI kit" }} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-6 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h4">Botones</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button onPress={playPressSound}>
            <Text>Default</Text>
          </Button>
          <Button variant="outline">
            <Text>Outline</Text>
          </Button>
          <Button variant="secondary">
            <Text>Secondary</Text>
          </Button>
          <Button variant="ghost">
            <Text>Ghost</Text>
          </Button>
          <Button variant="destructive">
            <Icon as={IconTrash} size={16} />
            <Text>Eliminar</Text>
          </Button>
          <Button variant="link">
            <Text>Link</Text>
          </Button>
          <Button size="sm">
            <Text>Small</Text>
          </Button>
          <Button size="lg">
            <Icon as={IconPlus} size={16} />
            <Text>Large</Text>
          </Button>
          <Button size="icon" variant="outline">
            <Icon as={IconPlus} size={16} />
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>

        <Separator />

        <Text variant="h4">Field + inputs</Text>
        <Field invalid={!!emailError}>
          <FieldLabel nativeID="email">Correo</FieldLabel>
          <Input
            aria-labelledby="email"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            invalid={!!emailError}
          />
          <FieldDescription>Nunca compartimos tu correo.</FieldDescription>
          <FieldError errors={emailError} />
        </Field>

        <Field>
          <FieldLabel>Monto</FieldLabel>
          <CurrencyInput value={amount} onChange={setAmount} placeholder="0" />
          <FieldDescription>Valor: {formatCOPCurrency(amount)}</FieldDescription>
        </Field>

        <Field>
          <Label>Nota</Label>
          <Textarea placeholder="Escribe una nota…" />
        </Field>

        <View className="flex-row items-center justify-between">
          <Label>Switch</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </View>

        <Select defaultValue={{ value: "cash", label: "Efectivo" }}>
          <SelectTrigger>
            <SelectValue placeholder="Método de pago" />
          </SelectTrigger>
          <SelectContent className="w-64">
            <SelectItem value="cash" label="Efectivo" />
            <SelectItem value="debit" label="Débito" />
            <SelectItem value="credit" label="Tarjeta de crédito" />
          </SelectContent>
        </Select>

        <Separator />

        <Text variant="h4">Skeleton</Text>
        <View className="flex-row items-center gap-3">
          <Skeleton className="size-12 rounded-[0.875rem]" />
          <View className="gap-2">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
          </View>
        </View>

        <Separator />

        <Text variant="h4">Overlays</Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Button variant="outline" onPress={() => setSheetOpen(true)}>
            <Text>Abrir sheet</Text>
          </Button>
          <Button variant="destructive" onPress={() => setConfirmOpen(true)}>
            <Icon as={IconTrash} size={16} />
            <Text>Confirmar borrado</Text>
          </Button>
          <AccountDrawer />
        </View>
        <DatePickerField value={date} onChange={setDate} />
        <SearchListField
          value={categoryId}
          onChange={setCategoryId}
          items={DEMO_CATEGORIES}
          getItemId={(item) => item.id}
          filterItem={(item, q) => item.name.toLowerCase().includes(q)}
          renderSelected={(item) => <Text numberOfLines={1}>{item.name}</Text>}
          renderOption={(item, selected) => (
            <Text className={`text-sm ${selected ? "font-figtree-semibold" : ""}`}>{item.name}</Text>
          )}
          placeholder="Elige una categoría"
        />
        <AppSheet
          isOpen={sheetOpen}
          onChange={setSheetOpen}
          header={<Text className="font-figtree-semibold text-lg tracking-tight">Nuevo gasto</Text>}
          footer={
            <View className="flex-row gap-2">
              <Button variant="secondary" size="lg" className="flex-1" onPress={() => setSheetOpen(false)}>
                <Text>Cancelar</Text>
              </Button>
              <Button size="lg" className="flex-1" onPress={() => setSheetOpen(false)}>
                <Icon as={IconCheck} size={18} />
                <Text className="font-figtree-semibold">Guardar</Text>
              </Button>
            </View>
          }
        >
          <View className="gap-3">
            <CurrencyInput value={amount} onChange={setAmount} />
            <Text variant="muted">Contenido de ejemplo con estilo GlobalModal.</Text>
          </View>
        </AppSheet>
        <ConfirmDialog
          isOpen={confirmOpen}
          title="¿Eliminar gasto?"
          description="Se eliminará este gasto de tu historial."
          confirmLabel="Eliminar"
          preview={{ title: "Almuerzo", amount: formatCOPCurrency(25000) }}
          onConfirm={() => showToast("success", "Gasto eliminado")}
          onClose={() => setConfirmOpen(false)}
        />

        <Separator />

        <Text variant="h4">Toasts y sonidos</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button variant="outline" onPress={() => showToast("success", "Gasto guardado")}>
            <Text>Toast success</Text>
          </Button>
          <Button variant="outline" onPress={() => showToast("warning", "Te queda poco presupuesto")}>
            <Text>Toast warning</Text>
          </Button>
          <Button variant="outline" onPress={() => showToast("error", "No se pudo guardar")}>
            <Text>Toast error</Text>
          </Button>
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Button variant="secondary" size="sm" onPress={playModalOpen}>
            <Text>open</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={playModalClose}>
            <Text>close</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={playPressSound}>
            <Text>press</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={playSuccessSound}>
            <Text>success</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={playErrorSound}>
            <Text>error</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
