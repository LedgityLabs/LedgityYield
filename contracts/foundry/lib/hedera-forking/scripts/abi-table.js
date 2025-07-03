#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0

const { readFileSync } = require('fs');
const { Fragment } = require('ethers');

/**
 * @param {string} kind
 * @param {unknown[]} abi
 * @param {{[sighash: string]: {notice: string}}} userdoc
 * @param {{[sighash: string]: {details: string}}} devdoc
 */
function* data(kind, abi, userdoc, devdoc) {
    for (const entry of abi) {
        const frag = Fragment.from(entry);
        if (frag.type === kind) {
            const sighash = frag.format('sighash');
            const [member] = frag.format('full').replace(`${kind} `, '').split(' returns ');
            const notice = (userdoc[sighash]?.notice ?? '').trim();
            const dev = (devdoc[sighash]?.details ?? '').trim();

            yield { member, notice, dev };
        }
    }
}

function main() {
    const jsonPath = process.argv.slice(2);
    if (jsonPath.length !== 1) throw new Error('Invalid json path to extract ABI from');

    const { abi, userdoc, devdoc } = JSON.parse(readFileSync(jsonPath[0], 'utf8'));

    const write = console.info;
    [
        ['Function', 'methods'],
        ['Event', 'events'],
    ].forEach(([kind, prop]) => {
        const members = [...data(kind.toLowerCase(), abi, userdoc[prop] ?? {}, devdoc[prop] ?? {})];
        if (members.length > 0) {
            write();
            write(`| ${kind} | Comment |`);
            write('|----------|---------|');
            for (const { member, notice, dev } of members) {
                const sep = notice !== '' && dev !== '' && !notice.endsWith('.') ? '.' : '';
                write(`| \`${member}\` | ${notice}${sep} ${dev} |`);
            }
        }
    });
}

main();
