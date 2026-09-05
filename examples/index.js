
import * as all from '../dist/app.mjs'

var app = window.app = all.app;

Object.assign(app, all)

import * as components from './company-site.js'

Object.assign(app.components, components);
app.components.companySite = app.components.companySite || app.components["company-site"];
app.components["company-site"] = app.components["company-site"] || app.components.companySite;

import * as templates from "./companySite*.html"

Object.assign(app.templates, templates);
app.templates.companySite = app.templates.companySite || app.templates["company-site"];
app.templates["company-site"] = app.templates["company-site"] || app.templates.companySite;

app.debug = 1
app.start();
all.$on(document, "alpine:init", () => { all.AlpinePlugin(Alpine) });

import Alpine from "alpinejs/dist/module.esm.js"
window.Alpine = Alpine;
Alpine.start();
