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
	email: "lohayharisoni445@gmail.com",
	linkedin: "https://www.linkedin.com/in/harisoni-lohay-143839446",
	github: "https://github.com/hson40722-ship-it"
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
		id: "urban-monitoring",
		title: "Urban Expansion Monitoring, Mbeya City (2000 to 2025)",
		category: "Urban",
		status: "progress",
		tools: ["Google Earth Engine", "Landsat", "Random Forest", "QGIS", "Leaflet"],
		summary: "Tracks where Mbeya City has grown, in which direction, and how land surface temperature and vegetation changed. Results are preliminary.",
		image: "assets/maps/mbeya_card.jpg",
		page: "",
		studyArea: "Mbeya City, Tanzania, 2000 to 2025.",
		problem: "",
		objectives: [
			"Map land cover (built-up, vegetation, cropland/grassland, bare land, water) for 2000, 2010, 2020 and 2025.",
			"Quantify built-up change for each period.",
			"Measure the direction of urban expansion in eight sectors around the city center.",
			"Compare built-up growth with land surface temperature and vegetation (NDVI) change."
		],
		data: [
			"Landsat Collection 2 Tier 1 Level-2 imagery (Landsat 5, 7, 8 and 9), dry-season composites.",
			"ESA WorldCover 2020, used to create training labels automatically."
		],
		methods: [
			"Dry-season Landsat composites built in Google Earth Engine.",
			"Random Forest classification of five land-cover classes.",
			"Built-up change statistics and an eight-direction sector analysis.",
			"Land-cover map layouts made in QGIS; dashboard built with Leaflet and Chart.js."
		],
		figures: [
			{ src: "assets/maps/mbeya_lulc_2025.jpg", alt: "Land use and land cover map of Mbeya Urban, 2025", caption: "Figure 1. Land use and land cover, Mbeya Urban, 2025." },
			{ src: "assets/maps/mbeya_lulc_2000.jpg", alt: "Land use and land cover map of Mbeya Urban, 2000", caption: "Figure 2. Land use and land cover, Mbeya Urban, 2000. This map is under review: it maps more built-up land than 2025, which points to classification errors." }
		],
		results: "Preliminary. The dashboard shows the figures together with a data quality check. The early-year maps contain classification errors, so growth rates should not be quoted yet.",
		limitations: "Training labels come from ESA WorldCover 2020, so the 2000 and 2010 maps are the least certain. Agreement with WorldCover is not a true accuracy assessment, which still needs reference points labelled in historical imagery. Temperature and vegetation changes show association with built-up growth, not proven cause.",
		references: [],
		links: [{ label: "Open the monitoring dashboard", url: "dashboard.html" }]
	},
	{
		id: "dar-ksat",
		title: "Soil Hydraulic Conductivity (Ksat) Map of Dar es Salaam",
		category: "Hydrology",
		status: "complete",
		tools: ["Google Earth Engine", "Raster analysis", "Digital cartography"],
		summary: "A map of saturated hydraulic conductivity (Ksat) for Dar es Salaam, Tanzania, produced in Google Earth Engine.",
		image: "assets/maps/dar_ksat_map.png",
		page: "",
		studyArea: "Dar es Salaam, Tanzania.",
		problem: "",
		objectives: ["Map soil hydraulic conductivity (Ksat) across the whole of Dar es Salaam, with a clear legend."],
		data: ["Global saturated hydraulic conductivity (Ksat) raster, 1 km resolution, 0-30 cm depth (Zenodo record 3934854)."],
		methods: ["Processed the Ksat raster in Google Earth Engine for the Dar es Salaam study area.", "Exported the final map as a PNG with a legend."],
		figures: [{ src: "assets/maps/dar_ksat_map.png", alt: "Map of soil hydraulic conductivity (Ksat) in Dar es Salaam, Tanzania", caption: "Figure 1. Soil hydraulic conductivity (Ksat), Dar es Salaam." }],
		results: "",
		limitations: "",
		references: [],
		links: []
	},
	{
		id: "lulc",
		title: "Land Use and Land Cover Mapping, Mbeya Urban",
		category: "Land Use / Land Cover",
		status: "progress",
		tools: ["Landsat", "QGIS", "Google Earth Engine", "Random Forest"],
		summary: "Five-class land-cover maps of Mbeya Urban for 2000, 2010, 2020 and 2025, made as part of the urban monitoring work.",
		image: "assets/maps/mbeya_lulc_2025.jpg",
		page: "",
		studyArea: "Mbeya Urban, Tanzania.",
		problem: "",
		objectives: ["Map land use and land cover across Mbeya Urban for four dates, each with a clear legend."],
		data: ["Landsat Collection 2 Tier 1 Level-2 imagery."],
		methods: ["Classified Landsat composites with a Random Forest model in Google Earth Engine.", "Exported the maps and laid them out in QGIS with a legend, scale bar and coordinate information."],
		figures: [
			{ src: "assets/maps/mbeya_lulc_2000.jpg", alt: "Land use and land cover map of Mbeya Urban, 2000", caption: "Figure 1. Mbeya Urban, 2000 (under review: see the dashboard data quality check)." },
			{ src: "assets/maps/mbeya_lulc_2010.jpg", alt: "Land use and land cover map of Mbeya Urban, 2010", caption: "Figure 2. Mbeya Urban, 2010." },
			{ src: "assets/maps/mbeya_lulc_2020.jpg", alt: "Land use and land cover map of Mbeya Urban, 2020", caption: "Figure 3. Mbeya Urban, 2020." },
			{ src: "assets/maps/mbeya_lulc_2025.jpg", alt: "Land use and land cover map of Mbeya Urban, 2025", caption: "Figure 4. Mbeya Urban, 2025." }
		],
		results: "",
		limitations: "Accuracy has not yet been assessed with independent reference points. The 2000 map shows signs of classification error.",
		references: [],
		links: [{ label: "See the maps on the dashboard", url: "dashboard.html#maps" }]
	},
	{
		id: "kilimanjaro-lulc",
		title: "Mount Kilimanjaro Land Use and Land Cover Change, 2010 to 2025",
		category: "Land Use / Land Cover",
		status: "complete",
		tools: ["Google Earth Engine", "Landsat", "QGIS", "PyQGIS"],
		summary: "A four-date land-cover comparison map (2010, 2015, 2020, 2025) of Mount Kilimanjaro, Northern Tanzania, from 30 m Landsat imagery.",
		image: "assets/maps/kilimanjaro_lulc_2010_2025.jpg",
		page: "",
		studyArea: "Mount Kilimanjaro, Northern Tanzania.",
		problem: "",
		objectives: ["Compare land use and land cover on Mount Kilimanjaro at four dates: 2010, 2015, 2020 and 2025."],
		data: ["Landsat imagery (USGS), 30 m resolution, processed in Google Earth Engine."],
		methods: [
			"Classified land cover into seven classes: forest, agriculture, built-up, grassland, bare land, water, and snow and ice.",
			"Laid out the four maps in QGIS with a legend, scale bar, north arrow, location map and map information box (UTM Zone 37S, EPSG:32737)."
		],
		figures: [{ src: "assets/maps/kilimanjaro_lulc_2010_2025.jpg", alt: "Four land use and land cover maps of Mount Kilimanjaro for 2010, 2015, 2020 and 2025, with legend and location map", caption: "Figure 1. Mount Kilimanjaro land use and land cover change, 2010 to 2025. Map date: 15 November 2026." }],
		results: "",
		limitations: "The 2010, 2015 and 2020 maps contain white areas with no data, and the 2020 map shows stripe-shaped gaps, so differences between years should be read with care. No accuracy assessment is reported here.",
		references: [],
		links: [{ label: "Open the full-size map", url: "assets/maps/kilimanjaro_lulc_2010_2025_full.png" }]
	},
	{
		id: "mbeya-terrain",
		title: "Mbeya City Terrain and Drainage Analysis",
		category: "Hydrology",
		status: "complete",
		tools: ["QGIS", "SRTM DEM", "Hillshade", "PyQGIS", "Matplotlib"],
		summary: "A terrain map of Mbeya City from a 30 m SRTM elevation model, with hypsometric relief, an extracted drainage network, drainage basin boundaries and a 3D block view.",
		image: "assets/maps/mbeya_terrain_drainage.jpg",
		page: "",
		studyArea: "Mbeya City, Tanzania.",
		problem: "",
		objectives: ["Show the relief of Mbeya City and how water drains across it."],
		data: ["SRTM digital elevation model, 30 m resolution."],
		methods: [
			"Derived elevation classes, hillshade and terrain visualisation from the DEM.",
			"Extracted the drainage network and drainage basin boundaries.",
			"Added a 3D block view from the south with a vertical exaggeration of 3 times.",
			"Laid out the map in QGIS 3.44 (UTM Zone 36S, EPSG:32736)."
		],
		figures: [{ src: "assets/maps/mbeya_terrain_drainage.jpg", alt: "Terrain and drainage map of Mbeya City showing elevation, drainage network, basin boundaries and a 3D block view", caption: "Figure 1. Mbeya City terrain and drainage analysis. Map prepared 15 November 2026." }],
		results: "The elevation classes on the map legend span about 1,357 m to 2,649 m.",
		limitations: "The map is based on a 30 m elevation model, so small features are not resolved. Drainage features are shown where available.",
		references: [],
		links: [{ label: "Open the full-size map", url: "assets/maps/mbeya_terrain_drainage_full.png" }]
	},
	{
		id: "mbeya-transport",
		title: "Mbeya City Transportation Network Map",
		category: "Transportation",
		status: "complete",
		tools: ["QGIS", "OpenStreetMap", "Digital cartography"],
		summary: "A road network map of Mbeya Urban by road class, with the main roads labelled, the urban boundary and a Tanzania location map.",
		image: "assets/maps/mbeya_transport_network.jpg",
		page: "",
		studyArea: "Mbeya City, Mbeya Region, Tanzania.",
		problem: "",
		objectives: ["Map the road network of Mbeya Urban by road class."],
		data: ["OpenStreetMap road data."],
		methods: [
			"Grouped roads into major roads (including T1, T8 and T10), secondary roads, tertiary roads and local roads.",
			"Labelled the main roads and laid out the map in QGIS with a legend, scale bar, north arrow, location map and map information box (UTM Zone 36S, EPSG:32736)."
		],
		figures: [{ src: "assets/maps/mbeya_transport_network.jpg", alt: "Road network map of Mbeya City by road class, with the urban boundary and a location map of Tanzania", caption: "Figure 1. Mbeya City transportation network. Map date: 11 November 2026." }],
		results: "",
		limitations: "OpenStreetMap is mapped by volunteers, so some roads may be missing or classed differently from official records.",
		references: [],
		links: [{ label: "Open the full-size map (large file)", url: "assets/maps/mbeya_transport_network_full.png" }]
	},
	{
		id: "water-mbeya",
		title: "Water Body Detection, Mbeya Region",
		category: "Hydrology",
		status: "complete",
		tools: ["Random Forest", "Remote sensing imagery"],
		summary: "Coursework project (GS 227) that detects water bodies in Mbeya Region with a Random Forest classifier.",
		image: "", page: "",
		studyArea: "Mbeya Region, Tanzania.",
		problem: "",
		objectives: [],
		data: [],
		methods: ["Random Forest classification of water bodies."],
		figures: [],
		results: "As reported in the coursework: overall accuracy of 76% and a Kappa of 0.72, with mapped water area rising from about 1,781 km² to about 3,306 km² between the two dates studied.",
		limitations: "",
		references: [],
		links: []
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
		status: "complete",
		tools: ["ArcGIS", "QGIS", "Multi-ring buffers"],
		summary: "Accessibility modelling and multi-ring buffer analysis, part of a team assessment of Kibaha Municipality (GS 224 Project II).",
		image: "", page: "",
		studyArea: "Kibaha Municipality, Tanzania.",
		problem: "",
		objectives: [],
		data: [],
		methods: ["Accessibility modelling and multi-ring buffers.", "Team project of ten members combining GIS, remote sensing and photogrammetry; I presented it at the final defense."],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "photogrammetry",
		title: "Photogrammetry and Terrain Modelling",
		category: "Photogrammetry",
		status: "complete",
		tools: ["Agisoft Metashape", "DEM", "DSM", "Orthomosaic"],
		summary: "UAV imagery processed into terrain and surface models, with a ground control accuracy check (GS 224 Project II).",
		image: "", page: "",
		studyArea: "Kibaha Municipality, Tanzania.",
		problem: "",
		objectives: [],
		data: ["UAV imagery."],
		methods: ["Processed UAV images in Agisoft Metashape into a digital surface model, a digital terrain model and an orthomosaic.", "Analysed ground control point (GCP) accuracy."],
		figures: [], results: "", limitations: "", references: [], links: []
	},
	{
		id: "ndvi-kongowe",
		title: "NDVI Trend Analysis, Kongowe Ward (2015 to 2025)",
		category: "Vegetation",
		status: "complete",
		tools: ["Landsat 8", "R", "Mann-Kendall test", "Sen's slope"],
		summary: "Vegetation trend analysis from Landsat 8 NDVI, tested with regression and the Mann-Kendall test (GS 224 Group 06).",
		image: "", page: "",
		studyArea: "Kongowe Ward, Tanzania.",
		problem: "",
		objectives: [],
		data: ["Landsat 8 imagery, 2015 to 2025."],
		methods: ["NDVI time series from Landsat 8.", "Trend tests in R: ordinary least squares regression, Mann-Kendall and Sen's slope."],
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
		id: "ubis",
		title: "Urban Building Information System (UBIS), Kisarawe Ward",
		category: "Web GIS",
		status: "planned",
		tools: ["PostgreSQL", "PostGIS", "FastAPI", "Leaflet"],
		summary: "A planned web GIS for managing building records and monitoring urban change from 2018 to 2025.",
		image: "", page: "",
		studyArea: "Kisarawe Ward, Kisarawe District Council, Pwani Region, Tanzania.",
		problem: "",
		objectives: ["Manage building records and monitor urban change using open data and satellite imagery only."],
		data: ["Open datasets and satellite imagery. No verified boundary or official building inventory has been supplied."],
		methods: [],
		figures: [],
		results: "",
		limitations: "Any demonstration records will be labelled as demonstration data, not real buildings.",
		references: [], links: []
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

// Project status: label and badge style
const STATUS = {
	complete: { label: "Completed", detail: "Completed", cls: "badge-complete" },
	progress: { label: "In progress", detail: "In progress: results are preliminary", cls: "badge-progress" },
	planned: { label: "Planned", detail: "Planned: no results yet", cls: "badge-planned" },
	placeholder: { label: "Placeholder", detail: "Placeholder: no real results yet", cls: "badge-placeholder" }
};
function statusOf(p) { return STATUS[p.status] || STATUS.placeholder; }

function isSafeUrl(url) {
	return typeof url === "string" && /^(https?:\/\/|\.{0,2}\/|assets\/|projects\/|[\w-]+\.html)/i.test(url);
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
		body.appendChild(el("span", "badge " + statusOf(p).cls, statusOf(p).label));
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
	box.appendChild(el("span", "badge " + statusOf(p).cls, statusOf(p).detail));

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
