import React from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";

// glob eagerly so we can synchronously build the route table
const modules = import.meta.glob<{
  default: React.ComponentType<any>;
}>("./*/index.tsx", { eager: true });

interface PageModule {
  name: string;
  component: React.ComponentType<any>;
}

function buildPageList(): PageModule[] {
  const pages: PageModule[] = [];
  for (const key in modules) {
    const match = key.match(/\.\/([^\/]+)\/index\.tsx$/);
    if (!match) continue;
    const name = match[1];
    pages.push({ name, component: modules[key].default });
  }
  return pages;
}

export function AppRoutes() {
  const pages = buildPageList();

  // index and notfound handled specially
  const indexPage = pages.find((p) => p.name.toLowerCase() === "index");
  const notFoundPage = pages.find((p) => p.name.toLowerCase() === "notfound");

  const childRoutes: RouteObject[] = pages
    .filter((p) => !["index", "notfound"].includes(p.name.toLowerCase()))
    .map((p) => ({
      path: p.name.toLowerCase(),
      element: <p.component />,
    }));

  if (indexPage) {
    // default route under /app
    childRoutes.unshift({ path: "", element: <indexPage.component /> });
  }

  // when AppRoutes is mounted at /app/* the base path is already consumed,
  // so the layout route should use an empty string to represent the same segment.
  const routes: RouteObject[] = [
    {
      path: "",
      element: <MainLayout />, // all pages under /app share the main layout
      children: childRoutes,
    },
  ];

  if (notFoundPage) {
    // when none of the above matches
    routes.push({ path: "*", element: <notFoundPage.component /> });
  }

  return useRoutes(routes);
}
