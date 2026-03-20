import type { Key } from "@heroui/react";
import {
  Autocomplete,
  Button,
  EmptyState,
  Label,
  ListBox,
  NumberField,
  SearchField,
  toast,
  useFilter,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { calculateValue, getStats, NAMES, type Values } from "asb-ts";
import { useState } from "react";

export const Route = createFileRoute("/calc_value")({
  component: CalcValueComponent,
});

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Autocomplete,
    NumberField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

function CalcValueComponent() {
  const { contains } = useFilter({ sensitivity: "base" });
  const items = [...NAMES.values()].map((n) => ({ id: n as Key, name: n }));

  const [values, setValues] = useState<Values | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      Health_wild: 0,
      Stamina_wild: 0,
      Oxygen_wild: 0,
      Food_wild: 0,
      Weight_wild: 0,
      MeleeDamageMultiplier_wild: 0,
      SpeedMultiplier_wild: 0,
      Torpidity_wild: 0,
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      try {
        const stats = getStats(value.name);
        const v = calculateValue(stats, {
          Health: { wild: value.Health_wild },
          Stamina: { wild: value.Stamina_wild },
          Oxygen: { wild: value.Oxygen_wild },
          Food: { wild: value.Food_wild },
          Water: { wild: 0 },
          Temperature: { wild: 0 },
          Weight: { wild: value.Weight_wild },
          MeleeDamageMultiplier: { wild: value.MeleeDamageMultiplier_wild },
          SpeedMultiplier: { wild: value.SpeedMultiplier_wild },
          TemperatureFortitude: { wild: 0 },
          CraftingSpeedMultiplier: { wild: 0 },
          Torpidity: { wild: value.Torpidity_wild },
        });
        setValues({ ...v });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) toast.danger(e.message);
        else toast.danger(`なんかエラーが出ました:${JSON.stringify(e)}`);
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.Autocomplete
              placeholder="選択してね"
              selectionMode="single"
              onChange={(key) => field.setValue(key as string)}
              aria-label="name"
            >
              <Label>🦖いきものの種類</Label>
              <Autocomplete.Trigger>
                <Autocomplete.Value />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
              </Autocomplete.Trigger>
              <Autocomplete.Popover>
                <Autocomplete.Filter filter={contains}>
                  <SearchField autoFocus name="search" variant="secondary">
                    <SearchField.Group>
                      <SearchField.SearchIcon />
                      <SearchField.Input placeholder="Search..." />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>
                  <ListBox
                    aria-label="listbox"
                    renderEmptyState={() => (
                      <EmptyState>見つからなんだ</EmptyState>
                    )}
                  >
                    {items.map((item) => (
                      <ListBox.Item
                        key={item.id}
                        id={item.id}
                        textValue={item.name}
                      >
                        {item.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </field.Autocomplete>
          )}
        </form.AppField>

        <form.AppField name="Health_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>❤体力</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Health}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Stamina_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🚴スタミナ</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Stamina}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Oxygen_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🏊酸素量</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Oxygen}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Food_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🍰食料</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Food}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Weight_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🏋️‍♂️重量</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Weight}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="MeleeDamageMultiplier_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🤺近接攻撃力[%]</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>
                  {Math.round((values?.MeleeDamageMultiplier ?? 0) * 100)}%
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="SpeedMultiplier_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🏃移動速度[%]</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>
                  {Math.round((values?.SpeedMultiplier ?? 0) * 100)}%
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Torpidity_wild">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>😵‍💫気絶値</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{values?.Torpidity}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppForm>
          <form.Button type="submit">計算</form.Button>
        </form.AppForm>
      </form>
    </div>
  );
}
