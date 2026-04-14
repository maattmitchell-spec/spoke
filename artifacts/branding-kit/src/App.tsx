import { Switch, Route } from "wouter";
import BrandingKit from "@/pages/BrandingKit";
import Support from "@/pages/Support";
import Marketing from "@/pages/Marketing";

const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${base}/support`} component={Support} />
      <Route path={`${base}/marketing`} component={Marketing} />
      <Route component={BrandingKit} />
    </Switch>
  );
}
