(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [105],
  {
    855: (e, t, r) => {
      Promise.resolve().then(r.bind(r, 6622));
    },
    6622: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { default: () => Z });
      var o = r(5155),
        a = r(2115),
        n = r(4581),
        i = r(4955),
        l = r(2596),
        s = r(7472),
        d = r(4391),
        c = r(4312),
        u = r(6324),
        p = r(680),
        v = r(186),
        h = r(3384),
        g = r(5170),
        y = r(870);
      function f(e) {
        return (0, y.Ay)("MuiPaper", e);
      }
      (0, g.A)("MuiPaper", [
        "root",
        "rounded",
        "outlined",
        "elevation",
        "elevation0",
        "elevation1",
        "elevation2",
        "elevation3",
        "elevation4",
        "elevation5",
        "elevation6",
        "elevation7",
        "elevation8",
        "elevation9",
        "elevation10",
        "elevation11",
        "elevation12",
        "elevation13",
        "elevation14",
        "elevation15",
        "elevation16",
        "elevation17",
        "elevation18",
        "elevation19",
        "elevation20",
        "elevation21",
        "elevation22",
        "elevation23",
        "elevation24",
      ]);
      let m = (0, c.Ay)("div", {
          name: "MuiPaper",
          slot: "Root",
          overridesResolver: (e, t) => {
            let { ownerState: r } = e;
            return [
              t.root,
              t[r.variant],
              !r.square && t.rounded,
              "elevation" === r.variant && t["elevation".concat(r.elevation)],
            ];
          },
        })(
          (0, p.A)((e) => {
            let { theme: t } = e;
            return {
              backgroundColor: (t.vars || t).palette.background.paper,
              color: (t.vars || t).palette.text.primary,
              transition: t.transitions.create("box-shadow"),
              variants: [
                {
                  props: (e) => {
                    let { ownerState: t } = e;
                    return !t.square;
                  },
                  style: { borderRadius: t.shape.borderRadius },
                },
                {
                  props: { variant: "outlined" },
                  style: {
                    border: "1px solid ".concat((t.vars || t).palette.divider),
                  },
                },
                {
                  props: { variant: "elevation" },
                  style: {
                    boxShadow: "var(--Paper-shadow)",
                    backgroundImage: "var(--Paper-overlay)",
                  },
                },
              ],
            };
          })
        ),
        x = a.forwardRef(function (e, t) {
          var r;
          let a = (0, v.b)({ props: e, name: "MuiPaper" }),
            n = (0, u.A)(),
            {
              className: i,
              component: c = "div",
              elevation: p = 1,
              square: g = !1,
              variant: y = "elevation",
              ...x
            } = a,
            b = { ...a, component: c, elevation: p, square: g, variant: y },
            A = ((e) => {
              let { square: t, elevation: r, variant: o, classes: a } = e;
              return (0, s.A)(
                {
                  root: [
                    "root",
                    o,
                    !t && "rounded",
                    "elevation" === o && "elevation".concat(r),
                  ],
                },
                f,
                a
              );
            })(b);
          return (0,
          o.jsx)(m, { as: c, ownerState: b, className: (0, l.A)(A.root, i), ref: t, ...x, style: { ...("elevation" === y && { "--Paper-shadow": (n.vars || n).shadows[p], ...(n.vars && { "--Paper-overlay": null == (r = n.vars.overlays) ? void 0 : r[p] }), ...(!n.vars && "dark" === n.palette.mode && { "--Paper-overlay": "linear-gradient(".concat((0, d.X4)("#fff", (0, h.A)(p)), ", ").concat((0, d.X4)("#fff", (0, h.A)(p)), ")") }) }), ...x.style } });
        });
      function b(e) {
        return (0, y.Ay)("MuiTableContainer", e);
      }
      (0, g.A)("MuiTableContainer", ["root"]);
      let A = (0, c.Ay)("div", { name: "MuiTableContainer", slot: "Root" })({
          width: "100%",
          overflowX: "auto",
        }),
        w = a.forwardRef(function (e, t) {
          let r = (0, v.b)({ props: e, name: "MuiTableContainer" }),
            { className: a, component: n = "div", ...i } = r,
            d = { ...r, component: n },
            c = ((e) => {
              let { classes: t } = e;
              return (0, s.A)({ root: ["root"] }, b, t);
            })(d);
          return (0,
          o.jsx)(A, { ref: t, as: n, className: (0, l.A)(c.root, a), ownerState: d, ...i });
        }),
        j = a.createContext();
      function C(e) {
        return (0, y.Ay)("MuiTable", e);
      }
      (0, g.A)("MuiTable", ["root", "stickyHeader"]);
      let k = (0, c.Ay)("table", {
          name: "MuiTable",
          slot: "Root",
          overridesResolver: (e, t) => {
            let { ownerState: r } = e;
            return [t.root, r.stickyHeader && t.stickyHeader];
          },
        })(
          (0, p.A)((e) => {
            let { theme: t } = e;
            return {
              display: "table",
              width: "100%",
              borderCollapse: "collapse",
              borderSpacing: 0,
              "& caption": {
                ...t.typography.body2,
                padding: t.spacing(2),
                color: (t.vars || t).palette.text.secondary,
                textAlign: "left",
                captionSide: "bottom",
              },
              variants: [
                {
                  props: (e) => {
                    let { ownerState: t } = e;
                    return t.stickyHeader;
                  },
                  style: { borderCollapse: "separate" },
                },
              ],
            };
          })
        ),
        M = "table",
        T = a.forwardRef(function (e, t) {
          let r = (0, v.b)({ props: e, name: "MuiTable" }),
            {
              className: n,
              component: i = M,
              padding: d = "normal",
              size: c = "medium",
              stickyHeader: u = !1,
              ...p
            } = r,
            h = { ...r, component: i, padding: d, size: c, stickyHeader: u },
            g = ((e) => {
              let { classes: t, stickyHeader: r } = e;
              return (0, s.A)({ root: ["root", r && "stickyHeader"] }, C, t);
            })(h),
            y = a.useMemo(
              () => ({ padding: d, size: c, stickyHeader: u }),
              [d, c, u]
            );
          return (0,
          o.jsx)(j.Provider, { value: y, children: (0, o.jsx)(k, { as: i, role: i === M ? null : "table", ref: t, className: (0, l.A)(g.root, n), ownerState: h, ...p }) });
        }),
        R = a.createContext();
      function S(e) {
        return (0, y.Ay)("MuiTableHead", e);
      }
      (0, g.A)("MuiTableHead", ["root"]);
      let H = (0, c.Ay)("thead", { name: "MuiTableHead", slot: "Root" })({
          display: "table-header-group",
        }),
        P = { variant: "head" },
        z = "thead",
        I = a.forwardRef(function (e, t) {
          let r = (0, v.b)({ props: e, name: "MuiTableHead" }),
            { className: a, component: n = z, ...i } = r,
            d = { ...r, component: n },
            c = ((e) => {
              let { classes: t } = e;
              return (0, s.A)({ root: ["root"] }, S, t);
            })(d);
          return (0,
          o.jsx)(R.Provider, { value: P, children: (0, o.jsx)(H, { as: n, className: (0, l.A)(c.root, a), ref: t, role: n === z ? null : "rowgroup", ownerState: d, ...i }) });
        });
      function N(e) {
        return (0, y.Ay)("MuiTableRow", e);
      }
      let E = (0, g.A)("MuiTableRow", [
          "root",
          "selected",
          "hover",
          "head",
          "footer",
        ]),
        _ = (0, c.Ay)("tr", {
          name: "MuiTableRow",
          slot: "Root",
          overridesResolver: (e, t) => {
            let { ownerState: r } = e;
            return [t.root, r.head && t.head, r.footer && t.footer];
          },
        })(
          (0, p.A)((e) => {
            let { theme: t } = e;
            return {
              color: "inherit",
              display: "table-row",
              verticalAlign: "middle",
              outline: 0,
              ["&.".concat(E.hover, ":hover")]: {
                backgroundColor: (t.vars || t).palette.action.hover,
              },
              ["&.".concat(E.selected)]: {
                backgroundColor: t.alpha(
                  (t.vars || t).palette.primary.main,
                  (t.vars || t).palette.action.selectedOpacity
                ),
                "&:hover": {
                  backgroundColor: t.alpha(
                    (t.vars || t).palette.primary.main,
                    ""
                      .concat(
                        (t.vars || t).palette.action.selectedOpacity,
                        " + "
                      )
                      .concat((t.vars || t).palette.action.hoverOpacity)
                  ),
                },
              },
            };
          })
        ),
        D = a.forwardRef(function (e, t) {
          let r = (0, v.b)({ props: e, name: "MuiTableRow" }),
            {
              className: n,
              component: i = "tr",
              hover: d = !1,
              selected: c = !1,
              ...u
            } = r,
            p = a.useContext(R),
            h = {
              ...r,
              component: i,
              hover: d,
              selected: c,
              head: p && "head" === p.variant,
              footer: p && "footer" === p.variant,
            },
            g = ((e) => {
              let { classes: t, selected: r, hover: o, head: a, footer: n } = e;
              return (0, s.A)(
                {
                  root: [
                    "root",
                    r && "selected",
                    o && "hover",
                    a && "head",
                    n && "footer",
                  ],
                },
                N,
                t
              );
            })(h);
          return (0,
          o.jsx)(_, { as: i, ref: t, className: (0, l.A)(g.root, n), role: "tr" === i ? null : "row", ownerState: h, ...u });
        });
      var q = r(3209);
      function B(e) {
        return (0, y.Ay)("MuiTableCell", e);
      }
      let F = (0, g.A)("MuiTableCell", [
          "root",
          "head",
          "body",
          "footer",
          "sizeSmall",
          "sizeMedium",
          "paddingCheckbox",
          "paddingNone",
          "alignLeft",
          "alignCenter",
          "alignRight",
          "alignJustify",
          "stickyHeader",
        ]),
        W = (0, c.Ay)("td", {
          name: "MuiTableCell",
          slot: "Root",
          overridesResolver: (e, t) => {
            let { ownerState: r } = e;
            return [
              t.root,
              t[r.variant],
              t["size".concat((0, q.A)(r.size))],
              "normal" !== r.padding &&
                t["padding".concat((0, q.A)(r.padding))],
              "inherit" !== r.align && t["align".concat((0, q.A)(r.align))],
              r.stickyHeader && t.stickyHeader,
            ];
          },
        })(
          (0, p.A)((e) => {
            let { theme: t } = e;
            return {
              ...t.typography.body2,
              display: "table-cell",
              verticalAlign: "inherit",
              borderBottom: t.vars
                ? "1px solid ".concat(t.vars.palette.TableCell.border)
                : "1px solid\n    ".concat(
                    "light" === t.palette.mode
                      ? t.lighten(t.alpha(t.palette.divider, 1), 0.88)
                      : t.darken(t.alpha(t.palette.divider, 1), 0.68)
                  ),
              textAlign: "left",
              padding: 16,
              variants: [
                {
                  props: { variant: "head" },
                  style: {
                    color: (t.vars || t).palette.text.primary,
                    lineHeight: t.typography.pxToRem(24),
                    fontWeight: t.typography.fontWeightMedium,
                  },
                },
                {
                  props: { variant: "body" },
                  style: { color: (t.vars || t).palette.text.primary },
                },
                {
                  props: { variant: "footer" },
                  style: {
                    color: (t.vars || t).palette.text.secondary,
                    lineHeight: t.typography.pxToRem(21),
                    fontSize: t.typography.pxToRem(12),
                  },
                },
                {
                  props: { size: "small" },
                  style: {
                    padding: "6px 16px",
                    ["&.".concat(F.paddingCheckbox)]: {
                      width: 24,
                      padding: "0 12px 0 16px",
                      "& > *": { padding: 0 },
                    },
                  },
                },
                {
                  props: { padding: "checkbox" },
                  style: { width: 48, padding: "0 0 0 4px" },
                },
                { props: { padding: "none" }, style: { padding: 0 } },
                { props: { align: "left" }, style: { textAlign: "left" } },
                { props: { align: "center" }, style: { textAlign: "center" } },
                {
                  props: { align: "right" },
                  style: { textAlign: "right", flexDirection: "row-reverse" },
                },
                {
                  props: { align: "justify" },
                  style: { textAlign: "justify" },
                },
                {
                  props: (e) => {
                    let { ownerState: t } = e;
                    return t.stickyHeader;
                  },
                  style: {
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: (t.vars || t).palette.background.default,
                  },
                },
              ],
            };
          })
        ),
        O = a.forwardRef(function (e, t) {
          let r,
            n = (0, v.b)({ props: e, name: "MuiTableCell" }),
            {
              align: i = "inherit",
              className: d,
              component: c,
              padding: u,
              scope: p,
              size: h,
              sortDirection: g,
              variant: y,
              ...f
            } = n,
            m = a.useContext(j),
            x = a.useContext(R),
            b = x && "head" === x.variant,
            A = p;
          "td" === (r = c || (b ? "th" : "td"))
            ? (A = void 0)
            : !A && b && (A = "col");
          let w = y || (x && x.variant),
            C = {
              ...n,
              align: i,
              component: r,
              padding: u || (m && m.padding ? m.padding : "normal"),
              size: h || (m && m.size ? m.size : "medium"),
              sortDirection: g,
              stickyHeader: "head" === w && m && m.stickyHeader,
              variant: w,
            },
            k = ((e) => {
              let {
                  classes: t,
                  variant: r,
                  align: o,
                  padding: a,
                  size: n,
                  stickyHeader: i,
                } = e,
                l = {
                  root: [
                    "root",
                    r,
                    i && "stickyHeader",
                    "inherit" !== o && "align".concat((0, q.A)(o)),
                    "normal" !== a && "padding".concat((0, q.A)(a)),
                    "size".concat((0, q.A)(n)),
                  ],
                };
              return (0, s.A)(l, B, t);
            })(C),
            M = null;
          return (
            g && (M = "asc" === g ? "ascending" : "descending"),
            (0, o.jsx)(W, {
              as: r,
              ref: t,
              className: (0, l.A)(k.root, d),
              "aria-sort": M,
              scope: A,
              ownerState: C,
              ...f,
            })
          );
        });
      function J(e) {
        return (0, y.Ay)("MuiTableBody", e);
      }
      (0, g.A)("MuiTableBody", ["root"]);
      let X = (0, c.Ay)("tbody", { name: "MuiTableBody", slot: "Root" })({
          display: "table-row-group",
        }),
        G = { variant: "body" },
        U = "tbody",
        K = a.forwardRef(function (e, t) {
          let r = (0, v.b)({ props: e, name: "MuiTableBody" }),
            { className: a, component: n = U, ...i } = r,
            d = { ...r, component: n },
            c = ((e) => {
              let { classes: t } = e;
              return (0, s.A)({ root: ["root"] }, J, t);
            })(d);
          return (0,
          o.jsx)(R.Provider, { value: G, children: (0, o.jsx)(X, { className: (0, l.A)(c.root, a), as: n, ref: t, role: n === U ? null : "rowgroup", ownerState: d, ...i }) });
        });
      var L = r(9788),
        V = r(7055);
      let Q = { projectId: "questionthem-90ccf" };
      function Y() {
        let e = (0, u.A)(),
          { dbOverview: t, loading: r, error: a } = (0, L.G)(),
          { user: l } = (0, V.J)();
        return r
          ? (0, o.jsx)(n.A, {
              sx: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                bgcolor: "background.default",
              },
              children: (0, o.jsx)(i.A, {
                variant: "h5",
                color: "text.primary",
                children: "Loading database overview...",
              }),
            })
          : a
          ? (0, o.jsx)(n.A, {
              sx: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                bgcolor: "background.default",
              },
              children: (0, o.jsxs)(i.A, {
                variant: "h5",
                color: "error.main",
                children: ["Error: ", a],
              }),
            })
          : (0, o.jsx)(n.A, {
              sx: {
                width: "100%",
                height: "100%",
                bgcolor: "background.default",
                color: "text.primary",
                fontFamily: e.typography.fontFamily,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
              children: (0, o.jsxs)(x, {
                sx: { maxWidth: "lg", width: "100%", p: 3, overflow: "auto" },
                children: [
                  (0, o.jsx)(i.A, {
                    variant: "h4",
                    sx: {
                      fontWeight: "bold",
                      mb: 3,
                      textAlign: "center",
                      color: "primary.main",
                    },
                    children: "Firestore Database Overview",
                  }),
                  (0, o.jsx)(w, {
                    children: (0, o.jsxs)(T, {
                      sx: { width: "100%", height: "100%", minWidth: "100%" },
                      children: [
                        (0, o.jsx)(I, {
                          children: (0, o.jsxs)(D, {
                            children: [
                              (0, o.jsx)(O, {
                                scope: "col",
                                children: "Collection Name",
                              }),
                              (0, o.jsx)(O, {
                                scope: "col",
                                children: "Document Count",
                              }),
                            ],
                          }),
                        }),
                        (0, o.jsx)(K, {
                          children:
                            t.length > 0
                              ? t.map((e, t) =>
                                  (0, o.jsxs)(
                                    D,
                                    {
                                      children: [
                                        (0, o.jsx)(O, { children: e.name }),
                                        (0, o.jsx)(O, { children: e.docCount }),
                                      ],
                                    },
                                    t
                                  )
                                )
                              : (0, o.jsx)(D, {
                                  children: (0, o.jsx)(O, {
                                    colSpan: 2,
                                    sx: { textAlign: "center" },
                                    children:
                                      "No collections found or configured.",
                                  }),
                                }),
                        }),
                      ],
                    }),
                  }),
                  (0, o.jsxs)(n.A, {
                    sx: {
                      mt: 3,
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      textAlign: "center",
                    },
                    children: [
                      (0, o.jsxs)(i.A, {
                        children: ["Project ID: ", Q.projectId],
                      }),
                      (0, o.jsxs)(i.A, {
                        children: [
                          "Authentication Status:",
                          " ",
                          l
                            ? "Authenticated (UID: ".concat(l.uid, ")")
                            : "Not Authenticated",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            });
      }
      function Z() {
        return (0, o.jsx)(o.Fragment, { children: (0, o.jsx)(Y, {}) });
      }
    },
    7055: (e, t, r) => {
      "use strict";
      r.d(t, { J: () => p, v: () => u });
      var o = r(5155),
        a = r(2115),
        n = r(3915),
        i = r(5404);
      let l = {
          apiKey: "AIzaSyDHaDT8V1oHWE5qnKXX1bn2C0kjxhI06pI",
          authDomain: "questionthem-90ccf.firebaseapp.com",
          projectId: "questionthem-90ccf",
          storageBucket: "questionthem-90ccf.appspot.com",
          messagingSenderId: "575809602490",
          appId: "1:575809602490:web:c90f1a128b592a162fd383",
        },
        s = l.apiKey ? (0, n.Wp)(l) : null,
        d = s ? (0, i.xI)(s) : null,
        c = (0, a.createContext)(null);
      function u(e) {
        let { children: t } = e,
          [r, n] = (0, a.useState)(null),
          [l, s] = (0, a.useState)(!0),
          [u, p] = (0, a.useState)(null),
          v = async (e) => {
            s(!0), p(null);
            try {
              if (d) await (0, i.p)(d, e);
              else throw Error("Firebase Auth not initialized.");
            } catch (e) {
              console.error("Error signing in with custom token:", e),
                p(e.message || "An error occurred during login.");
            } finally {
              s(!1);
            }
          },
          h = async () => {
            s(!0), p(null);
            try {
              d && (await (0, i.CI)(d));
            } catch (e) {
              console.error("Error signing out:", e),
                p(e.message || "An error occurred during sign out.");
            } finally {
              s(!1);
            }
          };
        return (
          (0, a.useEffect)(() => {
            if (d) {
              let e = (0, i.hg)(d, (e) => {
                n(e), s(!1);
              });
              return () => e();
            }
            s(!1);
          }, []),
          (0, o.jsx)(c.Provider, {
            value: {
              user: r,
              loading: l,
              error: u,
              loginWithToken: v,
              logout: h,
            },
            children: t,
          })
        );
      }
      function p() {
        let e = (0, a.useContext)(c);
        if (null === e)
          throw Error("useUser must be used within a UserProvider.");
        return e;
      }
    },
    9788: (e, t, r) => {
      "use strict";
      r.d(t, { G: () => d, n: () => s });
      var o = r(5155),
        a = r(2115),
        n = r(5317),
        i = r(7055);
      let l = (0, a.createContext)(null);
      function s(e) {
        let { children: t } = e,
          { user: r, loading: s } = (0, i.J)(),
          [d, c] = (0, a.useState)([]),
          [u, p] = (0, a.useState)(!0),
          [v, h] = (0, a.useState)(null),
          g = [
            "_meta_dataBlueprint",
            "_meta_schemas",
            "_meta_uiConfig",
            "administrations",
            "agencies",
            "companies",
            "events",
            "legislative_bodies",
            "locations",
            "organizations",
            "persons",
            "relationships",
            "scripts",
            "stories",
            "trumpcryptoworld",
            "videos",
          ];
        return (
          (0, a.useEffect)(() => {
            !s &&
              r &&
              (async () => {
                try {
                  p(!0), h(null);
                  let e = (0, n.aU)(),
                    t = [];
                  for (let r of g) {
                    let o = await (0, n.GG)((0, n.rJ)(e, r));
                    t.push({ name: r, docCount: o.size });
                  }
                  c(t);
                } catch (e) {
                  console.error("Error fetching database overview: ", e),
                    h(e.message);
                } finally {
                  p(!1);
                }
              })();
          }, [r, s]),
          (0, o.jsx)(l.Provider, {
            value: { dbOverview: d, loading: u, error: v },
            children: t,
          })
        );
      }
      function d() {
        let e = (0, a.useContext)(l);
        if (null === e)
          throw Error(
            "useDataBase must be used within a FirestoreDataProvider."
          );
        return e;
      }
    },
  },
  (e) => {
    e.O(0, [965, 135, 84, 140, 441, 964, 358], () => e((e.s = 855))),
      (_N_E = e.O());
  },
]);
