import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Chip, EmptyState, KpiTile, Panel, SearchField, ToneStatus } from "@/components/ui/primitives";
import { patchStatus, workflowTone } from "@/lib/status";

interface OTAsset {
  name: string;
  type: string;
  vendor: string;
  firmware: string;
  lastSeen: string;
  purdueLevel: number;
  protocols: string[];
  patchStatus: "Up to date" | "Patch available" | "End-of-life";
  riskScore: number;
}

const OT_ASSETS: OTAsset[] = [
  { name: "DCS Controller DC-01", type: "DCS", vendor: "Honeywell", firmware: "R520.1", lastSeen: "Live", purdueLevel: 2, protocols: ["OPC-UA", "Modbus TCP"], patchStatus: "Up to date", riskScore: 12 },
  { name: "DCS Controller DC-02", type: "DCS", vendor: "Honeywell", firmware: "R520.1", lastSeen: "Live", purdueLevel: 2, protocols: ["OPC-UA", "Modbus TCP"], patchStatus: "Up to date", riskScore: 15 },
  { name: "PLC-A-01 (Compression A)", type: "PLC", vendor: "Siemens", firmware: "V17.0 SP3", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet", "OPC-UA"], patchStatus: "Up to date", riskScore: 18 },
  { name: "PLC-A-02 (Compression A)", type: "PLC", vendor: "Siemens", firmware: "V17.0 SP3", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet", "OPC-UA"], patchStatus: "Up to date", riskScore: 18 },
  { name: "PLC-B-01 (Compression B)", type: "PLC", vendor: "Siemens", firmware: "V17.0 SP2", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet", "OPC-UA"], patchStatus: "Patch available", riskScore: 34 },
  { name: "PLC-B-02 (Compression B)", type: "PLC", vendor: "Siemens", firmware: "V16.0 SP4", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet"], patchStatus: "Patch available", riskScore: 42 },
  { name: "PLC-CW-01 (Cooling Water)", type: "PLC", vendor: "Siemens", firmware: "V17.0 SP3", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet", "OPC-UA"], patchStatus: "Up to date", riskScore: 14 },
  { name: "PLC-F-01 (Flare)", type: "PLC", vendor: "Siemens", firmware: "V17.0 SP3", lastSeen: "Live", purdueLevel: 1, protocols: ["Profinet"], patchStatus: "Up to date", riskScore: 20 },
  { name: "HMI-A-001", type: "HMI", vendor: "Honeywell", firmware: "Experion R520", lastSeen: "Live", purdueLevel: 2, protocols: ["OPC-UA"], patchStatus: "Up to date", riskScore: 22 },
  { name: "HMI-A-002", type: "HMI", vendor: "Honeywell", firmware: "Experion R510", lastSeen: "Live", purdueLevel: 2, protocols: ["OPC-UA"], patchStatus: "Patch available", riskScore: 38 },
  { name: "HMI-B-001", type: "HMI", vendor: "Honeywell", firmware: "Experion R520", lastSeen: "Live", purdueLevel: 2, protocols: ["OPC-UA"], patchStatus: "Up to date", riskScore: 22 },
  { name: "HMI-B-002", type: "HMI", vendor: "Honeywell", firmware: "Experion R500", lastSeen: "3 hr ago", purdueLevel: 2, protocols: ["OPC-UA"], patchStatus: "End-of-life", riskScore: 72 },
  { name: "RTU-ML-01 (Marine Loading)", type: "RTU", vendor: "ABB", firmware: "RTU560 v9.2", lastSeen: "Live", purdueLevel: 1, protocols: ["IEC 61850", "Modbus"], patchStatus: "Up to date", riskScore: 16 },
  { name: "RTU-FW-01 (Firewater)", type: "RTU", vendor: "ABB", firmware: "RTU560 v9.2", lastSeen: "Live", purdueLevel: 1, protocols: ["Modbus"], patchStatus: "Up to date", riskScore: 14 },
  { name: "PI Historian Server", type: "Historian", vendor: "OSIsoft", firmware: "PI Server 2024", lastSeen: "Live", purdueLevel: 3, protocols: ["PI-SDK", "OPC-HDA"], patchStatus: "Up to date", riskScore: 24 },
  { name: "PI Interface Node 01", type: "Historian", vendor: "OSIsoft", firmware: "PI ICU 2023", lastSeen: "Live", purdueLevel: 3, protocols: ["OPC-DA"], patchStatus: "Patch available", riskScore: 36 },
  { name: "Engineering Workstation EW-001", type: "Engineering workstation", vendor: "Dell", firmware: "Win 10 LTSC 2021", lastSeen: "2 hr ago", purdueLevel: 3, protocols: ["SSH", "RDP"], patchStatus: "Patch available", riskScore: 48 },
  { name: "Engineering Workstation EW-002", type: "Engineering workstation", vendor: "Dell", firmware: "Win 10 LTSC 2021", lastSeen: "5 hr ago", purdueLevel: 3, protocols: ["SSH", "RDP"], patchStatus: "Patch available", riskScore: 48 },
  { name: "Engineering Workstation EW-003", type: "Engineering workstation", vendor: "Dell", firmware: "Win 10 LTSC 2019", lastSeen: "Live", purdueLevel: 3, protocols: ["SSH", "RDP"], patchStatus: "End-of-life", riskScore: 68 },
  { name: "OT Switch SW-L1-01", type: "OT switch", vendor: "Cisco", firmware: "IE 5000 v17.9", lastSeen: "Live", purdueLevel: 1, protocols: ["Ethernet/IP"], patchStatus: "Up to date", riskScore: 8 },
  { name: "OT Switch SW-L1-02", type: "OT switch", vendor: "Cisco", firmware: "IE 5000 v17.9", lastSeen: "Live", purdueLevel: 1, protocols: ["Ethernet/IP"], patchStatus: "Up to date", riskScore: 8 },
  { name: "OT Switch SW-L2-01", type: "OT switch", vendor: "Cisco", firmware: "IE 5000 v17.8", lastSeen: "Live", purdueLevel: 2, protocols: ["Ethernet/IP"], patchStatus: "Patch available", riskScore: 28 },
  { name: "OT Firewall FW-DMZ-01", type: "OT firewall", vendor: "Palo Alto", firmware: "PAN-OS 11.1", lastSeen: "Live", purdueLevel: 3.5, protocols: ["IPS/IDS"], patchStatus: "Up to date", riskScore: 10 },
  { name: "OT Firewall FW-DMZ-02", type: "OT firewall", vendor: "Palo Alto", firmware: "PAN-OS 11.0", lastSeen: "Live", purdueLevel: 3.5, protocols: ["IPS/IDS"], patchStatus: "Patch available", riskScore: 26 },
  { name: "SIS Controller SIS-01", type: "SIS", vendor: "Honeywell", firmware: "Safety Manager SC", lastSeen: "Live (read-only)", purdueLevel: 1, protocols: ["SIL3 certified"], patchStatus: "Up to date", riskScore: 6 },
  { name: "SIS Controller SIS-02", type: "SIS", vendor: "Honeywell", firmware: "Safety Manager SC", lastSeen: "Live (read-only)", purdueLevel: 1, protocols: ["SIL3 certified"], patchStatus: "Up to date", riskScore: 6 },
  { name: "Smart Transmitter Gateway GTW-01", type: "Smart sensor", vendor: "Emerson", firmware: "AMS v14.0", lastSeen: "Live", purdueLevel: 1, protocols: ["HART", "WirelessHART"], patchStatus: "Up to date", riskScore: 12 },
  { name: "Smart Transmitter Gateway GTW-02", type: "Smart sensor", vendor: "Emerson", firmware: "AMS v14.0", lastSeen: "Live", purdueLevel: 1, protocols: ["HART", "WirelessHART"], patchStatus: "Up to date", riskScore: 12 },
  { name: "Vibration Monitor Node VM-01", type: "Smart sensor", vendor: "Fluke", firmware: "3563 v3.2", lastSeen: "2 hr ago", purdueLevel: 1, protocols: ["WiFi", "MQTT"], patchStatus: "Patch available", riskScore: 32 },
  { name: "Power Meter PM-01", type: "Smart sensor", vendor: "Schneider", firmware: "ION 9000 v4.1", lastSeen: "Live", purdueLevel: 1, protocols: ["Modbus TCP"], patchStatus: "Up to date", riskScore: 10 },
  { name: "Power Meter PM-02", type: "Smart sensor", vendor: "Schneider", firmware: "ION 9000 v4.0", lastSeen: "Live", purdueLevel: 1, protocols: ["Modbus TCP"], patchStatus: "Patch available", riskScore: 22 },
  { name: "Gas Detector GD-01", type: "Smart sensor", vendor: "Dräger", firmware: "PIR 7000 v2.4", lastSeen: "Live", purdueLevel: 0, protocols: ["4-20mA", "HART"], patchStatus: "Up to date", riskScore: 4 },
  { name: "Gas Detector GD-02", type: "Smart sensor", vendor: "Dräger", firmware: "PIR 7000 v2.4", lastSeen: "Live", purdueLevel: 0, protocols: ["4-20mA", "HART"], patchStatus: "Up to date", riskScore: 4 },
  { name: "CCTV NVR NVR-01", type: "Smart sensor", vendor: "Hikvision", firmware: "v4.62", lastSeen: "Live", purdueLevel: 2, protocols: ["RTSP", "ONVIF"], patchStatus: "End-of-life", riskScore: 58 },
  { name: "Access Control Panel ACP-01", type: "Smart sensor", vendor: "HID Global", firmware: "v8.3", lastSeen: "Live", purdueLevel: 2, protocols: ["Wiegand", "OSDP"], patchStatus: "Up to date", riskScore: 14 },
  { name: "Weather Station WS-01", type: "Smart sensor", vendor: "Vaisala", firmware: "WXT536 v2.1", lastSeen: "Live", purdueLevel: 0, protocols: ["SDI-12", "Modbus"], patchStatus: "Up to date", riskScore: 2 },
  { name: "LDAR Detector LDAR-01", type: "Smart sensor", vendor: "Teledyne", firmware: "Hi-Flow v3.0", lastSeen: "Hourly", purdueLevel: 0, protocols: ["USB", "BLE"], patchStatus: "Up to date", riskScore: 6 },
  { name: "UPS Controller UPS-01", type: "Smart sensor", vendor: "Eaton", firmware: "9PX v2.8", lastSeen: "Live", purdueLevel: 1, protocols: ["SNMP", "Modbus"], patchStatus: "Up to date", riskScore: 8 },
  { name: "HVAC Controller HVAC-01", type: "Smart sensor", vendor: "Johnson Controls", firmware: "Metasys v12", lastSeen: "Live", purdueLevel: 2, protocols: ["BACnet", "Modbus"], patchStatus: "Patch available", riskScore: 28 },
  { name: "Analyser System AN-01", type: "Smart sensor", vendor: "ABB", firmware: "Sensi+ v5.1", lastSeen: "Live", purdueLevel: 1, protocols: ["Modbus", "HART"], patchStatus: "Up to date", riskScore: 10 },
];

const OTAssetRegistry = () => {
  const [search, setSearch] = useState("");
  const [filterPatch, setFilterPatch] = useState<string>("all");

  const filtered = OT_ASSETS.filter(a => {
    if (filterPatch !== "all" && a.patchStatus !== filterPatch) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.type.toLowerCase().includes(search.toLowerCase()) && !a.vendor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upToDate = OT_ASSETS.filter(a => a.patchStatus === "Up to date").length;
  const patchAvail = OT_ASSETS.filter(a => a.patchStatus === "Patch available").length;
  const eol = OT_ASSETS.filter(a => a.patchStatus === "End-of-life").length;
  const highRisk = OT_ASSETS.filter(a => a.riskScore > 50).length;

  return (
    <PageHeader
      title="OT Asset Registry"
      subtitle="Comprehensive inventory of all OT assets: IEC 62443 asset management"
      actions={
        <>
          <SearchField value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets…" aria-label="Search assets" />
          {["all", "Up to date", "Patch available", "End-of-life"].map(f => (
            <Chip key={f} active={filterPatch === f} onClick={() => setFilterPatch(f)}>
              {f === "all" ? "All" : f}
            </Chip>
          ))}
        </>
      }
    >

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total OT Assets", value: OT_ASSETS.length.toString() },
          { label: "Up to Date", value: upToDate.toString() },
          { label: "Patch Available", value: patchAvail.toString() },
          { label: "End-of-Life / High Risk", value: `${eol} EOL · ${highRisk} high risk`, color: "text-error" },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Table */}
      <Panel title="OT Assets" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Asset Name</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Type</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Vendor</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Firmware</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Last Seen</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">Purdue</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Protocols</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Patch Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={i} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{a.name}</td>
                  <td className="py-2 px-3 type-body-sm">{a.type}</td>
                  <td className="py-2 px-3">{a.vendor}</td>
                  <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{a.firmware}</td>
                  <td className="py-2 px-3 type-body-sm">{a.lastSeen}</td>
                  <td className="py-2 px-3 text-center tabular whitespace-nowrap">{a.purdueLevel}</td>
                  <td className="py-2 px-3 type-body-sm">{a.protocols.join(", ")}</td>
                  <td className="py-2 px-3"><ToneStatus tone={workflowTone(patchStatus, a.patchStatus).tone} solid={workflowTone(patchStatus, a.patchStatus).solid}>{a.patchStatus}</ToneStatus></td>
                  <td className="py-2 px-3 text-right tabular font-semibold whitespace-nowrap">
                    <span className={a.riskScore > 50 ? "text-error" : a.riskScore > 30 ? "text-warning" : ""}>{a.riskScore}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}><EmptyState title="No assets match this filter" className="min-h-[96px]" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default OTAssetRegistry;
