const path = require("path");
const http = require("http");
const { URL } = require("url");
const fs = require("fs");
const esbuild = require("esbuild");
const plugin = require(__dirname + "/esbuild-app");

const opts = {
    entryPoints: [path.resolve(__dirname, '..', 'src', 'entry', 'index.js')],
    outfile: 'bundle.js',
    platform: 'browser',
    metafile: true,
    bundle: true,
    plugins: [plugin],
    logLevel: 'info',
};

// When running esbuild in serve/watch mode, the outfile must be inside the servedir.
if (process.argv.includes("--watch")) {
    const serveOut = path.resolve(__dirname, '..', 'src', 'entry', 'bundle.js');
    opts.outfile = serveOut;
}

(async () => {
    if (process.argv.includes("--watch")) {
        var ctx = await esbuild.context(opts);
        await ctx.watch();

        const serveDir = path.resolve(__dirname, '..', 'src', 'entry');
        const { hosts, port } = await ctx.serve({ host: "127.0.0.1", servedir: serveDir, fallback: "index.html" });

        const server = http.createServer((req, res) => {
            // Use WHATWG URL API to parse request URL safely
            const parsed = new URL(req.url, `http://127.0.0.1`);
            let forwardPath = parsed.pathname + parsed.search;
            if (/\.(m?js|html)(\?|$)/.test(forwardPath)) {
                forwardPath = '/' + path.basename(parsed.pathname) + parsed.search;
            }
            const options = { port, hostname: hosts[0], path: forwardPath, method: req.method, headers: req.headers }
            const preq = http.request(options, pres => {
                if (parsed.pathname.endsWith(".mjs")) {
                    pres.headers["content-type"] = "text/javascript";
                }
                res.writeHead(pres.statusCode, pres.headers)
                pres.pipe(res, { end: true })
            });
            req.pipe(preq, { end: true });
        });

        function openBrowser(siteUrl) {
            try {
                const { exec } = require('child_process');
                if (process.platform === 'win32') {
                    exec(`start ${siteUrl}`);
                } else if (process.platform === 'darwin') {
                    exec(`open ${siteUrl}`);
                } else {
                    exec(`xdg-open ${siteUrl}`);
                }
            } catch (e) {
                // ignore opener failures
            }
        }

        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                const fallbackUrl = `http://${hosts[0]}:${port}/`;
                console.log(`Port 8090 in use, serving at ${fallbackUrl}`);
                openBrowser(fallbackUrl);
            } else {
                console.error(err);
                process.exit(1);
            }
        });

        server.listen(8090, () => {
            const siteUrl = "http://127.0.0.1:8090/";
            console.log(" !! Please point your browser to " + siteUrl)
            openBrowser(siteUrl);
        });
    } else {
        await esbuild.build(opts);

        try { var mjs = await fs.promises.stat(path.resolve(__dirname, '..', 'src', 'entry', 'index.mjs')) } catch (e) {}
        if (mjs) {
            opts.entryPoints = [path.resolve(__dirname, '..', 'src', 'entry', 'index.mjs')];
            opts.platform = "neutral"
            opts.outfile = 'bundle.mjs'
            await esbuild.build(opts);
        }
    }
})();
