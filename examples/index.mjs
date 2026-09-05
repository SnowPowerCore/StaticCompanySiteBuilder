
import Alpine from "alpinejs/dist/module.esm.js"

import { AlpinePlugin, app, on, start } from '../dist/app.mjs'

import * as components from './company-site.js'

Object.assign(app.components, components);
app.components.companySite = app.components.companySite || app.components["company-site"];
app.components["company-site"] = app.components["company-site"] || app.components.companySite;

import * as templates from "./companySite*.html"

Object.assign(app.templates, templates);
app.templates.companySite = app.templates.companySite || app.templates["company-site"];
app.templates["company-site"] = app.templates["company-site"] || app.templates.companySite;

window.app = app;
app.debug = 1
start();

on('dom:changed', (ev) => {
    document.documentElement.setAttribute('data-bs-theme', ev.colorScheme);
});

Alpine.plugin(AlpinePlugin);

Alpine.start();
