import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <Link to="/calc_value">レベルから個体値を算出</Link>
    </div>
  );
}
