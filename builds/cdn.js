
import * as all from '../src/index.ts'

Object.assign(all.app, all)

window.app = all.app

all.$on(document, "alpine:init", () => { all.AlpinePlugin(Alpine) });
