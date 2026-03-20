import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/calc_value">レベル→個体値</Link>
        </li>
        <li>
          <Link to="/calc_level">個体値→レベル</Link>
        </li>
      </ul>
    </div>
  );
}
