---
title: Issue #1 — When log sources go quiet
date: 2026-10-22
summary: Wazuh tells you an agent is connected. It doesn't tell you that its Sysmon channel stopped sending yesterday. Here's why that gap matters and the open-source plugin I built to close it.
type: issue
tags: Wazuh, Detection engineering, SourceWatch, Log health
---

Welcome to the first issue of **The Detection Brief**. Every issue covers one practical problem from real SOC work, the fix, and anything new I've released for the Wazuh community.

## The problem: silence looks like safety

A connected agent is not the same as a working log source. When a Sysmon service stops, a firewall stops forwarding syslog, or a log file is rotated away, the dashboard stays green. No alerts fire, and that quiet looks exactly like a calm day.

The detections that depended on that source are now blind, and nobody is told.

> If a source stops sending, every rule that relied on it stops working too. The question isn't *"is the agent up?"* but *"is every source still feeding my detections?"*

## The fix: SourceWatch

[SourceWatch](https://github.com/DShamzaj/wazuh-sourcewatch) is a free Wazuh dashboard plugin that watches every log source individually.

- **Discovers sources automatically.** Every agent, log location and Windows event channel that produces events is tracked, with no configuration.
- **Learns each source's normal rhythm.** Busy, periodic and rare sources are judged against their own baseline, so a weekly job isn't flagged as dead on day two.
- **Shows what you lose.** For each source you see the rules, MITRE techniques and tactics it fed over the last 30 days. That's exactly what goes blind if it stops.
- **Raises native Wazuh alerts.** State changes land in `wazuh-alerts-*` with MITRE mapping, so your existing notifications pick them up.

### Health states

| State | Meaning |
|---|---|
| Learning | New source, still building its baseline |
| Healthy | Reporting within its normal rhythm |
| Delayed | Quiet for longer than usual |
| Silent | Quiet far beyond its normal rhythm |
| Volume drop | Still reporting, but far fewer events than normal |
| Missing | Required by a contract but never seen |

**Contracts** let you declare which sources every agent in a group must send, for example that every domain controller must send Security, Sysmon and PowerShell logs. Anything required that never shows up is flagged as Missing.

## Try it

SourceWatch is tested on Wazuh 4.14.9. Installation is a single plugin command on the dashboard host:

```bash
sudo -u wazuh-dashboard /usr/share/wazuh-dashboard/bin/opensearch-dashboards-plugin \
  install file:///path/to/sourcewatch-<version>.zip
```

Full steps, indexer permissions and the bundled rule pack are in the [README](https://github.com/DShamzaj/wazuh-sourcewatch).

Windows event channels, `wazuh-archives-*` and very large fleets aren't validated yet. If you run any of these, test reports are very welcome. Reply to this email or open an issue on GitHub.

---

*SourceWatch is an independent community project, not affiliated with or endorsed by Wazuh, Inc.*
