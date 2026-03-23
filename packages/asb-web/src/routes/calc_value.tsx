import type { Key } from "@heroui/react";
import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  NumberField,
  SearchField,
  useFilter,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  calculateValue,
  getStats,
  type LevelsIn,
  LevelsSchema,
  NAME_DICT,
  searchNameFromDict,
  type Values,
} from "asb-ts";
import { useState } from "react";
import * as v from "valibot";

export const Route = createFileRoute("/calc_value")({
  component: CalcValueComponent,
});

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Autocomplete,
    NumberField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

function CalcValueComponent() {
  const { contains } = useFilter({ sensitivity: "base" });
  const items = [...NAME_DICT.values()].map((n) => ({
    id: n.en as Key,
    name: n.ja,
  }));
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
      Torpidity_wild: 0,
    },
    validators: {
      onChange: ({ value }) => {
        const name = searchNameFromDict(value.name);
        if (!name) return;
        const stats = getStats(name);
        const parsed = v.safeParse(LevelsSchema, {
          health: { wild: value.Health_wild },
          stamina: { wild: value.Stamina_wild },
          oxygen: { wild: value.Oxygen_wild },
          food: { wild: value.Food_wild },
          water: { wild: 0 },
          temperature: { wild: 0 },
          weight: { wild: value.Weight_wild },
          meleeDamageMultiplier: { wild: value.MeleeDamageMultiplier_wild },
          speedMultiplier: { wild: 0 },
          temperatureFortitude: { wild: 0 },
          craftingSpeedMultiplier: { wild: 0 },
          torpidity: { wild: value.Torpidity_wild },
        } satisfies LevelsIn);
        if (!parsed.success) return;
        const result = calculateValue(stats, parsed.output);
        setValues(result);
      },
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
                <output>{values?.health}</output>
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
                <output>{values?.stamina}</output>
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
                <output>{values?.oxygen}</output>
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
                <output>{values?.food}</output>
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
                <output>{values?.weight}</output>
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
                  {Math.round((values?.meleeDamageMultiplier ?? 0) * 100)}%
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
                <output>{values?.torpidity}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>
      </form>
    </div>
  );
}
