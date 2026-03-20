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
import { calculateLevel, getStats, type Levels, NAMES } from "asb-ts";
import { useState } from "react";

export const Route = createFileRoute("/calc_level")({
  component: CalcLevelComponent,
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

function CalcLevelComponent() {
  const { contains } = useFilter({ sensitivity: "base" });
  const items = [...NAMES.values()].map((n) => ({ id: n as Key, name: n }));

  const [levels, setLevels] = useState<Levels | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      Health: 0,
      Stamina: 0,
      Oxygen: 0,
      Food: 0,
      Weight: 0,
      MeleeDamageMultiplier: 0,
      Torpidity: 0,
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      try {
        const stats = getStats(value.name);
        const l = calculateLevel(stats, {
          Health: value.Health,
          Stamina: value.Stamina,
          Oxygen: value.Oxygen,
          Food: value.Food,
          Water: 0,
          Temperature: 0,
          Weight: value.Weight,
          MeleeDamageMultiplier: value.MeleeDamageMultiplier,
          SpeedMultiplier: 0,
          TemperatureFortitude: 0,
          CraftingSpeedMultiplier: 0,
          Torpidity: value.Torpidity,
        });
        console.log(l);
        setLevels({ ...l });
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

        <form.AppField name="Health">
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
                <output>{levels?.Health.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Stamina">
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
                <output>{levels?.Stamina.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Oxygen">
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
                <output>{levels?.Oxygen.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Food">
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
                <output>{levels?.Food.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Weight">
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
                <output>{levels?.Weight.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="MeleeDamageMultiplier">
          {(field) => (
            <field.NumberField
              defaultValue={0}
              minValue={0}
              formatOptions={{ style: "percent" }}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🤺近接攻撃力[%]</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>{levels?.MeleeDamageMultiplier.wild}</output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Torpidity">
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
                <output>{levels?.Torpidity.wild}</output>
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
