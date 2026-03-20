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
  calculateLevel,
  getStats,
  type Levels,
  NAMES,
  NameSchema,
  PositiveValueSchema,
  type ValuesIn,
  ValuesSchema,
} from "asb-ts";
import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import * as v from "valibot";

const searchSchema = v.pipe(
  v.object({
    n: v.fallback(v.string(), ""),
    h: v.fallback(PositiveValueSchema, 0),
    s: v.fallback(PositiveValueSchema, 0),
    o: v.fallback(PositiveValueSchema, 0),
    f: v.fallback(PositiveValueSchema, 0),
    w: v.fallback(PositiveValueSchema, 0),
    m: v.fallback(PositiveValueSchema, 0),
  }),
);

export const Route = createFileRoute("/calc_level")({
  component: CalcLevelComponent,
  validateSearch: searchSchema,
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

function CalcLevelComponent() {
  const { contains } = useFilter({ sensitivity: "base" });
  const items = [...NAMES.values()].map((n) => ({ id: n as Key, name: n }));
  const [levels, setLevels] = useState<Levels | null>(null);
  const { n, h, s, o, f, w, m } = Route.useSearch();

  const data = useMemo(() => {
    if (!levels) return [];
    return [
      { subject: "❤", A: levels.health.wild, fullMark: 50 },
      { subject: "🏃", A: levels.stamina.wild, fullMark: 50 },
      { subject: "🏊", A: levels.oxygen.wild, fullMark: 50 },
      { subject: "🍰", A: levels.food.wild, fullMark: 50 },
      { subject: "🏋️‍♂️", A: levels.weight.wild, fullMark: 50 },
      {
        subject: "🤺",
        A: levels.meleeDamageMultiplier.wild,
        fullMark: 50,
      },
    ];
  }, [levels]);

  const defaultValues = {
    name: n,
    Health: h,
    Stamina: s,
    Oxygen: o,
    Food: f,
    Weight: w,
    MeleeDamageMultiplier: m,
    Torpidity: 0,
  };

  const updateLevels = ({ value }: { value: typeof defaultValues }) => {
    const nameParsed = v.safeParse(NameSchema, value.name);
    if (!nameParsed.success) return;
    const stats = getStats(nameParsed.output);
    const valuesParsed = v.safeParse(ValuesSchema, {
      health: value.Health,
      stamina: value.Stamina,
      oxygen: value.Oxygen,
      food: value.Food,
      water: 0,
      temperature: 0,
      weight: value.Weight,
      meleeDamageMultiplier: value.MeleeDamageMultiplier,
      speedMultiplier: 0,
      temperatureFortitude: 0,
      craftingSpeedMultiplier: 0,
      torpidity: value.Torpidity,
    } satisfies ValuesIn);
    if (!valuesParsed.success) return;
    const result = calculateLevel(stats, valuesParsed.output);
    setLevels(result);
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onMount: updateLevels,
      onChange: updateLevels,
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.Autocomplete
              defaultValue={field.state.value}
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
              defaultValue={field.state.value}
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
                <output>
                  {levels?.health.wild}
                  {levels?.health.error ? ` ± ${levels?.health.error}` : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Stamina">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
              minValue={0}
              onChange={(v) => field.setValue(v)}
            >
              <Label>🏃スタミナ</Label>
              <div className="flex items-center gap-2">
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <output>
                  {levels?.stamina.wild}
                  {levels?.stamina.error ? ` ± ${levels.stamina.error}` : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Oxygen">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
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
                <output>
                  {levels?.oxygen.wild}
                  {levels?.oxygen.error ? ` ± ${levels.oxygen.error}` : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Food">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
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
                <output>
                  {levels?.food.wild}
                  {levels?.food.error ? ` ± ${levels.food.error}` : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Weight">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
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
                <output>
                  {levels?.weight.wild}
                  {levels?.weight.error ? ` ± ${levels.weight.error}` : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="MeleeDamageMultiplier">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
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
                <output>
                  {levels?.meleeDamageMultiplier.wild}
                  {levels?.meleeDamageMultiplier.error
                    ? ` ± ${levels.meleeDamageMultiplier.error}`
                    : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>

        <form.AppField name="Torpidity">
          {(field) => (
            <field.NumberField
              defaultValue={field.state.value}
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
                <output>
                  {levels?.torpidity.wild}
                  {levels?.torpidity.error
                    ? ` ± ${levels.torpidity.error}`
                    : ""}
                </output>
              </div>
            </field.NumberField>
          )}
        </form.AppField>
      </form>

      <RadarChart
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          aspectRatio: 1,
        }}
        responsive
        outerRadius="80%"
        data={data}
        margin={{
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
        }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 50]} tickCount={6} />
        <Radar
          name="main"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </div>
  );
}
