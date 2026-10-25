/* ==========================================================
	 HAL.GEO Portfolio — script.js
	 Vanilla JavaScript. No build step, no API keys.
	 Sections: 1 Config · 2 Project data · 3 Helpers · 4 Nav ·
						 5 Projects · 6 Map · 7 CV button · 8 Contact · 9 Init
	 ========================================================== */
"use strict";

/* ----------------------------------------------------------
	 1. CONFIG — EDIT these when you have real details.
	 Leave a value as "" to keep the placeholder on the page.
	 ---------------------------------------------------------- */
const SITE_CONFIG = {
	email: "",      // e.g. "name@example.com"
	linkedin: "",   // e.g. "https://www.linkedin.com/in/your-profile"
	github: ""      // e.g. "https://github.com/your-username"
};

// Add real GeoJSON files here later (put files in assets/maps/).
// Example: { name: "Study area", url: "assets/maps/study-area.geojson" }
const GEOJSON_LAYERS = [];

/* ----------------------------------------------------------
	 2. PROJECT DATA — add a new project by copying one object.
	 Empty fields show "[Placeholder: to be added]" automatically.
	 status: "placeholder" or "complete"
	 page (optional): path to a full project page, e.g. "projects/lulc.html"
	 image (optional): thumbnail, e.g. "assets/images/lulc-thumb.jpg"
	 ---------------------------------------------------------- */
const PROJECTS = [
	{
		id: "lulc",
		title: "Land Use and Land Cover Mapping",
		category: "Land Use / Land Cover",
		status: "placeholder",
		tools: ["Landsat", "QGIS", "Google Earth Engine"],
		summary: "Placeholder: classification of land use and land cover from satellite imagery.",
		image: "",
		page: "",
		studyArea: "",
		problem: "",
		objectives: [],
		data: [],
		methods: [],
		figures: [],   // e.g. [{ src: "assets/maps/lulc.png", alt: "Land cover map of ...", caption: "Figure 1 ..." }]
		results: "",
		limitations: "",
		references: [],
		links: []      // e.g. [{ label: "Code on GitHub", url: "https://github.com/..." }]
	},
	{
		id: "agri-suitability",
		title: "Agricultural Suitability Analysis",
		category: "Agriculture",
		status: "placeholder",
		tools: ["GIS", "Remote Sensing", "Raster analysis"],
		summary: "Placeholder: suitability modelling for agriculture using GIS and remote sensing.",
		image: "", page: "",
		studyArea: "", problem: "", objectives: [], data: [], methods: [],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "urban-access",
		title: "Urban Accessibility Analysis",
		category: "Urban",
		status: "placeholder",
		tools: ["QGIS", "Distance analysis", "Network analysis"],
		summary: "Placeholder: accessibility mapping of services in an urban area.",
		image: "", page: "",
		studyArea: "", problem: "", objectives: [], data: [], methods: [],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "photogrammetry",
		title: "Photogrammetry and Terrain Modelling",
		category: "Photogrammetry",
		status: "placeholder",
		tools: ["DEM", "DSM", "Orthomosaic"],
		summary: "Placeholder: terrain and surface models derived from imagery.",
		image: "", page: "",
		studyArea: "", problem: "", objectives: [], data: [], methods: [],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "rainfall-climate",
		title: "Rainfall and Climate Analysis",
		category: "Climate",
		status: "placeholder",
		tools: ["Python", "R", "Google Earth Engine"],
		summary: "Placeholder: analysis of rainfall and climate patterns.",
		image: "", page: "",
		studyArea: "", problem: "", objectives: [], data: [], methods: [],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "webgis-db",
		title: "Spatial Database and Web GIS Development",
		category: "Web GIS",
		status: "placeholder",
		tools: ["PostgreSQL", "PostGIS", "Leaflet", "JavaScript"],
		summary: "Placeholder: a spatial database and an interactive web map.",
		image: "", page: "",
		studyArea: "", problem: "", objectives: [], data: [], methods: [],
		figures: [], results: "", limitations: "", references: [], links: []
	}
];

/* ----------------------------------------------------------
	 3. HELPERS
	 ---------------------------------------------------------- */
function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}
const PLACEHOLDER_TEXT = "[Placeholder: to be added]";

function isSafeUrl(url) {
	return typeof url === "string" && /^(https?:\/\/|\.{0,2}\/|assets\/|projects\/)/i.test(url);
}

/* ----------------------------------------------------------
	 4. NAVIGATION + FOOTER YEAR
	 ---------------------------------------------------------- */
function initNav() {
	const toggle = document.getElementById("navToggle");
	const links = document.getElementById("navLinks");
	if (!toggle || !links) return;

	const setOpen = (open) => {
		links.classList.toggle("open", open);
		toggle.setAttribute("aria-expanded", String(open));
	};
	toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
	links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && links.classList.contains("open")) { setOpen(false); toggle.focus(); }
	});

	// Highlight the link for the section currently in view
	if ("IntersectionObserver" in window) {
		const map = {};
		links.querySelectorAll("a[href^='#']").forEach((a) => { map[a.getAttribute("href").slice(1)] = a; });
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && map[entry.target.id]) {
					Object.values(map).forEach((a) => a.classList.remove("active"));
					map[entry.target.id].classList.add("active");
				}
			});
		}, { rootMargin: "-40% 0px -55% 0px" });
		Object.keys(map).forEach((id) => {
			const section = document.getElementById(id);
			if (section) observer.observe(section);
		});
	}
}

function initYear() {
	const y = document.getElementById("year");
	if (y) y.textContent = new Date().getFullYear();
}

/* ----------------------------------------------------------
	 5. PROJECTS: filters, cards, detail dialog
	 ---------------------------------------------------------- */
let activeFilter = "All";

function renderFilters() {
	const wrap = document.getElementById("projectFilters");
	if (!wrap) return;
	const categories = ["All", ...new Set(PROJECTS.map((p) => p.category))];
	wrap.textContent = "";
	categories.forEach((cat) => {
		const btn = el("button", "filter-btn", cat);
		btn.type = "button";
		btn.setAttribute("aria-pressed", String(cat === activeFilter));
		if (cat === activeFilter) btn.classList.add("active");
		btn.addEventListener("click", () => {
			activeFilter = cat;
			renderFilters();
			renderProjects();
		});
		wrap.appendChild(btn);
	});
}

function renderProjects() {
	const grid = document.getElementById("projectsGrid");
	if (!grid) return;
	grid.textContent = "";
	const list = PROJECTS.filter((p) => activeFilter === "All" || p.category === activeFilter);

	if (list.length === 0) {
		grid.appendChild(el("p", "notice", "No projects in this category yet."));
		return;
	}

	list.forEach((p) => {
		const card = el("article", "card project-card");

		const thumb = el("div", "project-thumb");
		thumb.appendChild(el("span", "", p.image ? "" : p.category));
		if (p.image && isSafeUrl(p.image)) {
			const img = document.createElement("img");
			img.src = p.image;
			img.alt = "Preview image for " + p.title;
			img.loading = "lazy";
			img.addEventListener("error", () => img.remove()); // falls back to the grid + category label
			thumb.appendChild(img);
		}
		card.appendChild(thumb);

		const body = el("div", "project-body");
		const isPlaceholder = p.status !== "complete";
		body.appendChild(el("span", "badge " + (isPlaceholder ? "badge-placeholder" : "badge-complete"),
			isPlaceholder ? "Placeholder" : "Completed"));
		body.appendChild(el("h3", "", p.title));
		body.appendChild(el("p", "", p.summary));

		const tools = el("ul", "tools");
		p.tools.forEach((t) => tools.appendChild(el("li", "", t)));
		body.appendChild(tools);

		const btn = el("button", "btn btn-ghost", "View details");
		btn.type = "button";
		btn.addEventListener("click", () => openProject(p));
		body.appendChild(btn);

		card.appendChild(body);
		grid.appendChild(card);
	});
}

function addTextSection(parent, title, value) {
	parent.appendChild(el("h3", "", title));
	if (value) parent.appendChild(el("p", "", value));
	else parent.appendChild(el("p", "editable", PLACEHOLDER_TEXT));
}

function addListSection(parent, title, items) {
	parent.appendChild(el("h3", "", title));
	if (items && items.length) {
		const ul = el("ul");
		items.forEach((i) => ul.appendChild(el("li", "", i)));
		parent.appendChild(ul);
	} else {
		parent.appendChild(el("p", "editable", PLACEHOLDER_TEXT));
	}
}

function buildDetail(p) {
	const box = el("div", "detail");
	const title = el("h2", "", p.title);
	title.id = "dlgTitle";
	box.appendChild(title);
	box.appendChild(el("span", "badge " + (p.status === "complete" ? "badge-complete" : "badge-placeholder"),
		p.status === "complete" ? "Completed" : "Placeholder: no real results yet"));

	addTextSection(box, "Study area", p.studyArea);
	addTextSection(box, "Problem statement", p.problem);
	addListSection(box, "Objectives", p.objectives);
	addListSection(box, "Data sources", p.data);
	addListSection(box, "Software and methods", p.methods.length ? p.methods : p.tools);

	// Figures
	box.appendChild(el("h3", "", "Maps, figures and screenshots"));
	if (p.figures && p.figures.length) {
		p.figures.forEach((f) => {
			const fig = el("figure");
			if (isSafeUrl(f.src)) {
				const img = document.createElement("img");
				img.src = f.src;
				img.alt = f.alt || "Project figure";
				img.loading = "lazy";
				img.addEventListener("error", () => {
					img.replaceWith(el("div", "figure-placeholder", "Image could not be loaded: " + f.src));
				});
				fig.appendChild(img);
			}
			if (f.caption) fig.appendChild(el("figcaption", "small", f.caption));
			box.appendChild(fig);
		});
	} else {
		box.appendChild(el("div", "figure-placeholder", "No figures yet. Add your maps to assets/maps/ and list them in script.js."));
	}

	addTextSection(box, "Results and discussion", p.results);
	addTextSection(box, "Limitations", p.limitations);
	addListSection(box, "References", p.references);

	// Links
	box.appendChild(el("h3", "", "Code and downloadable outputs"));
	const links = (p.links || []).filter((l) => isSafeUrl(l.url));
	if (p.page && isSafeUrl(p.page)) links.unshift({ label: "Open full project page", url: p.page });
	if (links.length) {
		const ul = el("ul");
		links.forEach((l) => {
			const li = el("li");
			const a = el("a", "", l.label || l.url);
			a.href = l.url;
			if (/^https?:/i.test(l.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
			li.appendChild(a);
			ul.appendChild(li);
		});
		box.appendChild(ul);
	} else {
		box.appendChild(el("p", "editable", "[Placeholder: no public code or outputs yet]"));
	}
	return box;
}

function initDialog() {
	const dialog = document.getElementById("projectDialog");
	const closeBtn = document.getElementById("dialogClose");
	if (!dialog || !closeBtn) return;
	closeBtn.addEventListener("click", () => dialog.close());
	// Close when clicking the dark backdrop
	dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
}

function openProject(p) {
	const dialog = document.getElementById("projectDialog");
	const body = document.getElementById("dialogBody");
	if (!dialog || !body) return;
	body.textContent = "";
	body.appendChild(buildDetail(p));
	if (typeof dialog.showModal === "function") {
		dialog.showModal();
	} else {
		dialog.setAttribute("open", ""); // very old browsers
	}
}

/* ----------------------------------------------------------
	 6. INTERACTIVE MAP (Leaflet) — needs internet for tiles
	 ---------------------------------------------------------- */
function setMapStatus(text, kind) {
	const s = document.getElementById("mapStatus");
	if (!s) return;
	s.textContent = text;
	s.className = "map-status" + (kind ? " " + kind : "");
}

function initMap() {
	const mapEl = document.getElementById("webmap");
	if (!mapEl) return;

	if (typeof L === "undefined") {
		setMapStatus("The map library could not be loaded. Check your internet connection and reload the page.", "error");
		mapEl.appendChild(el("p", "notice", "Map unavailable: Leaflet failed to load."));
		return;
	}

	const DAR = [-6.7924, 39.2083]; // Dar es Salaam (approximate city centre)
	const map = L.map("webmap", { center: DAR, zoom: 11, zoomControl: true });

	const basemaps = {
		osm: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
		}),
		sat: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
			maxZoom: 18,
			attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
		})
	};

	let current = null;
	let loaded = 0;
	let failed = 0;

	function wire(layer) {
		layer.on("tileload", () => {
			loaded++;
			if (loaded === 1) setMapStatus("Map tiles loaded.", "ok");
		});
		layer.on("tileerror", () => {
			failed++;
			if (loaded === 0 && failed >= 3) {
				setMapStatus("Map tiles could not be loaded. Check your internet connection or try the other basemap.", "error");
			}
		});
	}
	wire(basemaps.osm);
	wire(basemaps.sat);

	function useBasemap(key) {
		if (current) map.removeLayer(current);
		loaded = 0; failed = 0;
		setMapStatus("Loading map…");
		current = basemaps[key] || basemaps.osm;
		current.addTo(map);
	}
	useBasemap("osm");

	const select = document.getElementById("basemapSelect");
	if (select) select.addEventListener("change", () => useBasemap(select.value));

	// Demonstration marker (NOT project data)
	const popup = el("div");
	popup.appendChild(el("strong", "", "Dar es Salaam, Tanzania"));
	popup.appendChild(el("br"));
	popup.appendChild(el("span", "", "Demonstration marker only. Not verified project data."));
	L.marker(DAR).addTo(map).bindPopup(popup);

	// Avoid scroll-trapping on mobile and desktop: enable wheel zoom only after a click
	map.scrollWheelZoom.disable();
	map.on("click", () => map.scrollWheelZoom.enable());
	mapEl.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

	// Load any GeoJSON layers you list in GEOJSON_LAYERS
	GEOJSON_LAYERS.forEach((cfg) => {
		fetch(cfg.url)
			.then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
			.then((data) => {
				const layer = L.geoJSON(data, {
					style: { color: "#22d3ee", weight: 2, fillOpacity: 0.15 },
					onEachFeature: (feature, lyr) => {
						const props = feature.properties || {};
						const box = el("div");
						box.appendChild(el("strong", "", props.name || cfg.name || "Feature"));
						if (props.description) { box.appendChild(el("br")); box.appendChild(el("span", "", props.description)); }
						lyr.bindPopup(box);
					}
				}).addTo(map);
				const b = layer.getBounds();
				if (b.isValid()) map.fitBounds(b, { padding: [30, 30] });
			})
			.catch((err) => setMapStatus("Could not load " + cfg.url + " (" + err.message + ").", "error"));
	});

	setTimeout(() => map.invalidateSize(), 300);
}

/* ----------------------------------------------------------
	 7. CV BUTTON — shows a friendly message if the PDF is missing
	 ---------------------------------------------------------- */
function initCV() {
	const btn = document.getElementById("cvButton");
	const msg = document.getElementById("cvMessage");
	if (!btn || !msg) return;

	btn.addEventListener("click", (e) => {
		e.preventDefault();
		const url = btn.getAttribute("href");
		const showMissing = () => {
			msg.hidden = false;
			msg.textContent = "My CV has not been added yet. Please check back soon. " +
				"(Owner: add assets/documents/Harisoni_Lohay_CV.pdf. If it is already there, test with Live Server or the published site, not by double-clicking the file.)";
		};
		fetch(url, { method: "HEAD" })
			.then((r) => {
				if (!r.ok) return showMissing();
				msg.hidden = true;
				const a = document.createElement("a");
				a.href = url;
				a.download = "Harisoni_Lohay_CV.pdf";
				document.body.appendChild(a);
				a.click();
				a.remove();
			})
			.catch(showMissing);
	});
}

/* ----------------------------------------------------------
	 8. CONTACT — fills in real details from SITE_CONFIG only
	 ---------------------------------------------------------- */
function fillContact(id, value, href) {
	const node = document.getElementById(id);
	if (!node || !value) return;
	const a = el("a", "", value);
	a.href = href;
	if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
	node.className = "";
	node.textContent = "";
	node.appendChild(a);
}

function initContact() {
	if (SITE_CONFIG.email) fillContact("contactEmail", SITE_CONFIG.email, "mailto:" + SITE_CONFIG.email);
	if (/^https:\/\//i.test(SITE_CONFIG.linkedin)) fillContact("contactLinkedin", SITE_CONFIG.linkedin, SITE_CONFIG.linkedin);
	if (/^https:\/\//i.test(SITE_CONFIG.github)) fillContact("contactGithub", SITE_CONFIG.github, SITE_CONFIG.github);
}

/* ----------------------------------------------------------
	 9. INIT
	 ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
	initYear();
	initNav();
	renderFilters();
	renderProjects();
	initDialog();
	initMap();
	initCV();
	initContact();
});
