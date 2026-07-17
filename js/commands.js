// ===========================
// Command registry + parser (PURE — no DOM, no imports from effects modules)
//
// This module is the property-tested control plane for the Command_Terminal.
// It contains no DOM access and no side effects so it can be exercised
// directly in Node (see tests/commands.test.mjs).
//
// Contract (see design.md -> Command_Terminal / Data Models -> Command Registry):
//
//   Command = {
//     name: string,
//     type: "navigate" | "output" | "clear" | "help",
//     section?: string,   // present iff type === "navigate" (target section id)
//     describe: string,   // one-line help text
//     output?: string     // static output for "output" commands
//   }
//
//   CommandResult =
//     | { status: "ok", command: Command }
//     | { status: "empty" }
//     | { status: "unknown", name: string, hint: string }
// ===========================

// Real section ids from index.html. Navigation commands are derived from these
// so the registry can never drift from the DOM (Requirement 2.2).
export const SECTION_IDS = [
    'home',
    'about',
    'skills',
    'projects',
    'architecture',
    'experience',
    'certifications',
    'contact'
];

// Hint shown for unrecognized commands. Must reference the `help` command
// (Requirement 2.3).
export const UNKNOWN_COMMAND_HINT = "Type 'help' for available commands.";

// Canonical contact data (Requirement 15.3). This corrects the stale content
// that previously lived in script.js (e.g. "GeeksforGeeks",
// "linkedin.com/in/rituraj-singh").
const CONTACT_OUTPUT = [
    'Contact:',
    '  email    : singh.ritooraj@gmail.com',
    '  github   : github.com/ritooraj01',
    '  linkedin : linkedin.com/in/rituraj-singh-0001'
].join('\n');

const WHOAMI_OUTPUT = [
    'Rituraj Singh',
    'DevOps Engineer | Cloud Infrastructure | SRE'
].join('\n');

// One-line descriptions for navigate commands, keyed by section id.
const NAVIGATE_DESCRIBE = {
    home: 'Jump to the top of the site',
    about: 'Scroll to the about section',
    skills: 'Scroll to the skills section',
    projects: 'Scroll to the projects section',
    architecture: 'Scroll to the architecture diagrams',
    experience: 'Scroll to the experience timeline',
    certifications: 'Scroll to the certifications section',
    contact: 'Scroll to the contact section'
};

/**
 * Build the command registry: a navigate command per real section id, plus the
 * non-navigation commands (help, clear, whoami, and the contact output command).
 * @returns {Record<string, Command>}
 */
function buildRegistry() {
    /** @type {Record<string, any>} */
    const registry = {};

    for (const section of SECTION_IDS) {
        registry[section] = {
            name: section,
            type: 'navigate',
            section,
            describe: NAVIGATE_DESCRIBE[section]
        };
    }

    registry.help = {
        name: 'help',
        type: 'help',
        describe: 'List all available commands'
    };

    registry.clear = {
        name: 'clear',
        type: 'clear',
        describe: 'Clear the terminal output'
    };

    registry.whoami = {
        name: 'whoami',
        type: 'output',
        describe: 'Print a one-line identity summary',
        output: WHOAMI_OUTPUT
    };

    registry.info = {
        name: 'info',
        type: 'output',
        describe: 'Print canonical contact details',
        output: CONTACT_OUTPUT
    };

    return registry;
}

/**
 * The default command registry.
 * @type {Record<string, Command>}
 */
export const COMMAND_REGISTRY = buildRegistry();

/**
 * Normalize raw terminal input: trim, lowercase, and collapse internal
 * whitespace to single spaces. Non-string input normalizes to "".
 * @param {string} raw
 * @returns {string}
 */
export function normalizeInput(raw) {
    if (typeof raw !== 'string') {
        return '';
    }
    return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Parse raw input into a CommandResult against the given registry.
 * @param {string} raw
 * @param {Record<string, Command>} [registry=COMMAND_REGISTRY]
 * @returns {CommandResult}
 */
export function parseCommand(raw, registry = COMMAND_REGISTRY) {
    const name = normalizeInput(raw);

    if (name === '') {
        return { status: 'empty' };
    }

    const command = registry[name];
    if (command) {
        return { status: 'ok', command };
    }

    return { status: 'unknown', name, hint: UNKNOWN_COMMAND_HINT };
}

/**
 * List every command in the registry, used to render `help` output.
 * @param {Record<string, Command>} [registry=COMMAND_REGISTRY]
 * @returns {Command[]}
 */
export function listCommands(registry = COMMAND_REGISTRY) {
    return Object.values(registry);
}

export default COMMAND_REGISTRY;
