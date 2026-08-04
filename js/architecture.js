// ===========================
// Architecture_Diagram — interactive animated SVG (Requirement 5)
//
//   5.1 at least one CI/CD pipeline + one cloud infrastructure diagram
//   5.2 hover/focus highlights a node (keyboard focus supports Requirement 12)
//   5.3 flow animates only while the diagram is in the viewport
//   5.4 reduced motion -> final state, no flow animation
//
// The diagrams are built as inline SVG so nodes are real, focusable, labelled
// elements. Edge flow uses CSS stroke-dashoffset gated by an `.in-view` class
// toggled by IntersectionObserver; the global reduced-motion block in
// motion.css disables the flow even if JS is disabled (5.4).
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

// Accent-cycle order (design.md): cyan -> purple -> green -> pink -> amber.
const ACCENTS = ['cyan', 'purple', 'green', 'pink', 'amber'];

const CI_CD_STEPS = [
    { label: 'GitHub', icon: 'fab fa-github' },
    { label: 'Jenkins', icon: 'fas fa-hammer' },
    { label: 'SonarQube', icon: 'fas fa-check-circle' },
    { label: 'Docker Build', icon: 'fab fa-docker' },
    { label: 'AWS ECR', icon: 'fas fa-box' },
    { label: 'ECS / EKS', icon: 'fas fa-server' },
    { label: 'ALB', icon: 'fas fa-balance-scale' },
    { label: 'Production', icon: 'fas fa-rocket' }
];

const CLOUD_LAYERS = [
    { title: 'Client Layer', boxes: [{ label: 'Users', icon: 'fas fa-users' }] },
    {
        title: 'Edge Layer',
        boxes: [
            { label: 'CloudFront', icon: 'fas fa-shield-alt' },
            { label: 'ALB', icon: 'fas fa-balance-scale' },
            { label: 'WAF', icon: 'fas fa-lock' }
        ]
    },
    {
        title: 'Application Layer',
        boxes: [
            { label: 'ECS Cluster', icon: 'fab fa-docker' },
            { label: 'EC2 Instances', icon: 'fas fa-server' }
        ]
    },
    {
        title: 'Data Layer',
        boxes: [
            { label: 'Redis Cluster', icon: 'fas fa-database' },
            { label: 'RabbitMQ', icon: 'fas fa-exchange-alt' },
            { label: 'RDS / S3', icon: 'fas fa-hdd' }
        ]
    },
    {
        title: 'Monitoring Layer',
        boxes: [
            { label: 'CloudWatch', icon: 'fas fa-chart-line' },
            { label: 'Alerts', icon: 'fas fa-bell' }
        ]
    }
];

function svgEl(tag, attrs = {}) {
    const el = globalThis.document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

export function buildPipelineSvg(title, steps) {
    const W = 920;
    const H = 160;
    const padding = 20;
    const stepW = (W - padding * 2) / steps.length;
    const boxW = 86;
    const boxH = 50;

    const svg = svgEl('svg', {
        viewBox: `0 0 ${W} ${H}`,
        class: 'arch-svg arch-pipeline',
        role: 'img',
        'aria-label': title
    });

    steps.forEach((step, i) => {
        const cx = padding + stepW * i + stepW / 2;
        const cy = H / 2 - 10;
        const accent = ACCENTS[i % ACCENTS.length];

        // Edge to next node (animated flow via stroke-dashoffset).
        if (i < steps.length - 1) {
            const nextCx = padding + stepW * (i + 1) + stepW / 2;
            const edge = svgEl('line', {
                x1: cx + boxW / 2, y1: cy, x2: nextCx - boxW / 2, y2: cy,
                class: `arch-edge arch-accent-${ACCENTS[(i + 1) % ACCENTS.length]}`
            });
            svg.appendChild(edge);
        }

        const g = svgEl('g', {
            class: `arch-node arch-accent-${accent}`,
            tabindex: '0',
            role: 'img',
            'aria-label': step.label
        });

        const rect = svgEl('rect', {
            x: cx - boxW / 2, y: cy - boxH / 2,
            width: boxW, height: boxH, rx: 12,
            class: 'arch-node-rect',
            fill: 'var(--surface-3)'
        });

        const foreign = svgEl('foreignObject', {
            x: cx - 15, y: cy - 20, width: 30, height: 30
        });
        foreign.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%;"><i class="${step.icon}" style="color:var(--text-muted); font-size:20px;"></i></div>`;

        const label = svgEl('text', {
            x: cx, y: cy + boxH / 2 - 8, 'text-anchor': 'middle', class: 'arch-node-label', style: 'font-size: 11px;'
        });
        label.textContent = step.label;

        g.appendChild(rect);
        g.appendChild(foreign);
        g.appendChild(label);
        svg.appendChild(g);
    });

    return svg;
}

function buildCloudSvg(title, layers) {
    const rowH = 96;
    const top = 36;
    const H = top + layers.length * rowH + 16;
    const W = 920;
    const boxW = 130;
    const boxH = 56;
    const gap = 30;
    const titleWidth = 180;
    const availableW = W - titleWidth;

    const svg = svgEl('svg', {
        viewBox: `0 0 ${W} ${H}`,
        class: 'arch-svg arch-cloud',
        role: 'img',
        'aria-label': title
    });

    layers.forEach((layer, li) => {
        const y = top + li * rowH;
        const accent = ACCENTS[li % ACCENTS.length];
        const totalW = layer.boxes.length * boxW + (layer.boxes.length - 1) * gap;
        const startX = titleWidth + (availableW - totalW) / 2;

        // Layer title.
        const titleEl = svgEl('text', {
            x: 16, y: y + boxH / 2, class: 'arch-layer-title', 'dominant-baseline': 'central'
        });
        titleEl.textContent = layer.title;
        svg.appendChild(titleEl);

        // Connector arrow from previous layer.
        if (li > 0) {
            const prevY = top + (li - 1) * rowH + boxH + 16;
            const centerX = titleWidth + availableW / 2;
            const arrow = svgEl('line', {
                x1: centerX, y1: prevY, x2: centerX, y2: y - 16,
                class: `arch-edge arch-accent-${accent}`
            });
            svg.appendChild(arrow);
        }

        layer.boxes.forEach((box, bi) => {
            const x = startX + bi * (boxW + gap);
            const g = svgEl('g', {
                class: `arch-node arch-accent-${accent}`,
                tabindex: '0',
                role: 'img',
                'aria-label': box.label
            });
            const rect = svgEl('rect', {
                x, y, width: boxW, height: boxH, rx: 12, class: 'arch-node-rect', fill: 'var(--surface-3)'
            });
            const foreign = svgEl('foreignObject', {
                x: x + 10, y: y + boxH/2 - 10, width: 20, height: 20
            });
            foreign.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%;"><i class="${box.icon}" style="color:var(--text-muted); font-size:16px;"></i></div>`;
            const label = svgEl('text', {
                x: x + boxW / 2 + 10, y: y + boxH / 2,
                'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'arch-node-label', style: 'font-size: 11px;'
            });
            label.textContent = box.label;
            g.appendChild(rect);
            g.appendChild(foreign);
            g.appendChild(label);
            svg.appendChild(g);
        });
    });

    return svg;
}

/**
 * Testable helper: wire highlight + flow for a single diagram root.
 * Exposed so the architecture interaction test can drive it without a full page.
 * @param {SVGElement} svg
 * @param {(el: Element) => void} [observe]  inject an IntersectionObserver stub
 */
export function wireDiagram(svg, observe) {
    const nodes = svg.querySelectorAll('.arch-node');

    // Hover + keyboard focus highlight (5.2, 12.3).
    nodes.forEach((node) => {
        const highlight = () => node.classList.add('is-highlighted');
        const unhighlight = () => node.classList.remove('is-highlighted');
        node.addEventListener('mouseenter', highlight);
        node.addEventListener('mouseleave', unhighlight);
        node.addEventListener('focus', highlight);
        node.addEventListener('blur', unhighlight);
    });

    // Flow runs only while in viewport (5.3).
    const startFlow = () => svg.classList.add('in-view');
    const stopFlow = () => svg.classList.remove('in-view');

    if (typeof observe === 'function') {
        observe(svg, startFlow, stopFlow);
    } else if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) startFlow();
                else stopFlow();
            });
        });
        io.observe(svg);
    }
}

export function initArchitecture() {
    // Container hooks injected into index.html (replacing the old div diagrams).
    const pipelineHost = globalThis.document.getElementById('ciCdDiagram');
    const cloudHost = globalThis.document.getElementById('cloudDiagram');

    if (pipelineHost) {
        const svg = buildPipelineSvg('CI/CD Pipeline Architecture', CI_CD_STEPS);
        pipelineHost.innerHTML = '';
        pipelineHost.appendChild(svg);
        wireDiagram(svg);
    }

    if (cloudHost) {
        const svg = buildCloudSvg('Cloud Infrastructure Architecture', CLOUD_LAYERS);
        cloudHost.innerHTML = '';
        cloudHost.appendChild(svg);
        wireDiagram(svg);
    }

    // Under reduced motion, force final state regardless of observer (5.4).
    if (prefersReducedMotion()) {
        globalThis.document
            .querySelectorAll('.arch-svg')
            .forEach((svg) => svg.classList.add('in-view', 'reduced'));
    }
}

export default initArchitecture;
