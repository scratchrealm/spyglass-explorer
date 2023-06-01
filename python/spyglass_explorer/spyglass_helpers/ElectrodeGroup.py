from typing import Optional, Dict, List
import spyglass.common as sgc
from .Session import Session
from .Probe import Probe


class ElectrodeGroup:
    def __init__(self, key: dict):
        self.key = key
        self.description: str = key['description']
        self.electrode_group_name: str = key['electrode_group_name']
        self.nwb_file_name: str = key['nwb_file_name']
        self.probe_id: str = key['probe_id']
        self.region_id: str= key['region_id']
        self.target_hemisphere: str = key['target_hemisphere']
    def __str__(self) -> str:
        return f"ElectrodeGroup({self.key})"
    def split_into_shanks(self) -> List['ElectrodeGroupShank']:
        from .Electrode import fetch_electrodes
        electrodes = fetch_electrodes(electrode_group=self)
        shanks: Dict[str, ElectrodeGroupShank] = {}
        probe_shank_list: List[str] = [] # for purpose of ordering
        for electrode in electrodes:
            if electrode.probe_shank not in shanks:
                shanks[electrode.probe_shank] = ElectrodeGroupShank(electrode_group=self, probe_shank=electrode.probe_shank)
                probe_shank_list.append(electrode.probe_shank)
            shanks[electrode.probe_shank].append_electrode(electrode)
        shanks_list = [shanks[probe_shank] for probe_shank in sorted(probe_shank_list)]
        return shanks_list

class ElectrodeGroupShank:
    def __init__(self, electrode_group: ElectrodeGroup, probe_shank: int):
        from .Electrode import Electrode
        self.electrode_group = electrode_group
        self.probe_shank = probe_shank
        self.electrodes: List[Electrode] = []
    def append_electrode(self, electrode):
        self.electrodes.append(electrode)
    def __str__(self):
        return f'ElectrodeGroupShank({self.electrode_group.electrode_group_name}, {self.probe_shank})'
    def __repr__(self):
        return str(self)

def fetch_electrode_groups(*,
    limit: Optional[int] = None,
    session: Optional[Session] = None,
    probe: Optional[Probe] = None,
    description: Optional[str] = None,
    electrode_group_name: Optional[str] = None,
    nwb_file_name: Optional[str] = None,
    probe_id: Optional[str] = None,
    region_id: Optional[str] = None,
    target_hemisphere: Optional[str] = None
):
    query = {}
    if session is not None:
        for k in session.key:
            query[k] = session.key[k]
    if probe is not None:
        for k in probe.key:
            query[k] = probe.key[k]
    if description is not None:
        query['description'] = description
    if electrode_group_name is not None:
        query['electrode_group_name'] = electrode_group_name
    if nwb_file_name is not None:
        query['nwb_file_name'] = nwb_file_name
    if probe_id is not None:
        query['probe_id'] = probe_id
    if region_id is not None:
        query['region_id'] = region_id
    if target_hemisphere is not None:
        query['target_hemisphere'] = target_hemisphere
    
    # return a generator object that yields ElectrodeGroup objects
    i = 0
    for key in (sgc.ElectrodeGroup & query):
        if limit is not None and i >= limit:
            break
        yield ElectrodeGroup(key)
        i += 1