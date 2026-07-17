// ===========================
// Command_Terminal DOM controller (Requirement 2)
//
// Owns the #terminal-input / #terminal-output DOM and delegates all parsing to
// the PURE command layer (js/commands.js). The pure reducer `applyCommand`
// (below) holds the command history as data and is exercised directly by the
// Property 3 test, so history ordering is verified without a real DOM.
// ===========================

import { parseCommand, listCommands, COMMAND_REGISTRY } from './commands.js';
import { scrollToSection } from './navigation.js';

/**
 * @typedef {Object} Entry
 * @property {string} command   the submitted command string (echoed)
 * @property {string} output    the rendered output for that command
 * @property {boolean} isError  whether the output is an error line
 */

/**
 * PURE: apply a submitted command to the current history.
 *
 * Returns a NEW history array (does not mutate `history`) containing the new
 * command echoed with its output appended, EXCEPT for `clear`, which returns
 * an empty array. This preserves submission order and pairing (Requirement 2.5)
 * and is the unit under Property 3.
 *
 * @param {Entry[]} history            current rendered entries
 * @param {string} rawInput            raw value from the input
 * @param {string[]} [sectionIds]      valid section ids (for navigate)
 * @param {(id: string) => void} [navigate]  side-effecting nav callback
 * @returns {Entry[]}
 */
export function applyCommand(history, rawInput, sectionIds = [], navigate) {
    const result = parseCommand(rawInput);

    if (result.status === 'empty') {
        // Nothing submitted: history unchanged.
        return history.slice();
    }

    if (result.status === 'unknown') {
        return [
            ...history,
            {
                command: rawInput,
                output: `Command not found: ${result.name}. ${result.hint}`,
                isError: true
            }
        ];
    }

    const { command } = result;

    if (command.type === 'clear') {
        return []; // 2.4
    }

    if (command.type === 'help') {
        const lines = listCommands(COMMAND_REGISTRY).map(
            (c) => `  ${c.name.padEnd(12)} ${c.describe}`
        );
        return [
            ...history,
            { command: rawInput, output: `Available commands:\n${lines.join('\n')}`, isError: false }
        ];
    }

    if (command.type === 'output') {
        return [
            ...history,
            { command: rawInput, output: command.output || '', isError: false }
        ];
    }

    if (command.type === 'navigate') {
        const section = command.section;
        if (sectionIds.includes(section) && typeof navigate === 'function') {
            navigate(section); // 2.2
        }
        return [
            ...history,
            { command: rawInput, output: `Scrolling to ${section}…`, isError: false }
        ];
    }

    return history.slice();
}

export function initTerminal() {
    const doc = globalThis.document;
    const terminalInput = doc.getElementById('terminal-input');
    const terminalOutput = doc.getElementById('terminal-output');
    if (!terminalInput || !terminalOutput) return;

    let history = [];
    const sectionIds = Object.values(COMMAND_REGISTRY)
        .filter((c) => c.type === 'navigate')
        .map((c) => c.section);

    function render() {
        terminalOutput.innerHTML = '';
        for (const entry of history) {
            const line = doc.createElement('div');
            line.className = 'terminal-cmd-line';

            const cmd = doc.createElement('span');
            cmd.className = 'terminal-cmd-echo';
            cmd.textContent = `visitor@portfolio:~$ ${entry.command}`;

            const out = doc.createElement('span');
            out.className = entry.isError ? 'terminal-cmd-error' : 'terminal-cmd-output';
            out.textContent = entry.output;

            line.appendChild(cmd);
            line.appendChild(doc.createElement('br'));
            line.appendChild(out);
            terminalOutput.appendChild(line);
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const raw = terminalInput.value;
        history = applyCommand(history, raw, sectionIds, scrollToSection);
        terminalInput.value = '';
        render();
    });
}

export default initTerminal;
