from typing import Optional
import spyglass.common as sgc
from .Session import Session
from .ElectrodeGroup import ElectrodeGroup
from .Probe import Probe


class Electrode:
    def __init__(self, key: dict):
        self.key = key
        self.bad_channel: str = key['bad_channel']
        self.contacts: str = key['contacts']
        self.electrode_group_name: str = key['electrode_group_name']
        self.electrode_id: int = key['electrode_id']
        self.filtering: str = key['filtering']
        self.impedance: float = key['impedance']
        self.name: str = key['name']
        self.nwb_file_name: str = key['nwb_file_name']
        self.original_reference_electrode: int = key['original_reference_electrode']
        self.probe_electrode: int = key['probe_electrode']
        self.probe_id: str = key['probe_id']
        self.probe_shank: str = key['probe_shank']
        self.region_id: int = key['region_id']
        self.x: float = key['x']
        self.x_warped: float = key['x_warped']
        self.y: float = key['y']
        self.y_warped: float = key['y_warped']
        self.z: float = key['z']
        self.z_warped: float = key['z_warped']
    def __str__(self) -> str:
        return f"Electrode({self.key})"

def fetch_electrodes(*,
    limit: Optional[int] = None,
    session: Optional[Session] = None,
    electrode_group: Optional[ElectrodeGroup] = None,
    probe: Optional[Probe] = None,
    bad_channel: Optional[str] = None,
    contacts: Optional[str] = None,
    electrode_group_name: Optional[str] = None,
    electrode_id: Optional[int] = None,
    filtering: Optional[str] = None,
    impedance: Optional[float] = None,
    name: Optional[str] = None,
    nwb_file_name: Optional[str] = None,
    original_reference_electrode: Optional[int] = None,
    probe_electrode: Optional[int] = None,
    probe_id: Optional[str] = None,
    probe_shank: Optional[str] = None,
    region_id: Optional[int] = None,
    x: Optional[float] = None,
    x_warped: Optional[float] = None,
    y: Optional[float] = None,
    y_warped: Optional[float] = None,
    z: Optional[float] = None,
    z_warped: Optional[float] = None
):
    query = {}
    if session is not None:
        for k in session.key:
            query[k] = session.key[k]
    if electrode_group is not None:
        for k in electrode_group.key:
            query[k] = electrode_group.key[k]
    if probe is not None:
        for k in probe.key:
            query[k] = probe.key[k]
    if bad_channel is not None:
        query['bad_channel'] = bad_channel
    if contacts is not None:
        query['contacts'] = contacts
    if electrode_group_name is not None:
        query['electrode_group_name'] = electrode_group_name
    if electrode_id is not None:
        query['electrode_id'] = electrode_id
    if filtering is not None:
        query['filtering'] = filtering
    if impedance is not None:
        query['impedance'] = impedance
    if name is not None:
        query['name'] = name
    if nwb_file_name is not None:
        query['nwb_file_name'] = nwb_file_name
    if original_reference_electrode is not None:
        query['original_reference_electrode'] = original_reference_electrode
    if probe_electrode is not None:
        query['probe_electrode'] = probe_electrode
    if probe_id is not None:
        query['probe_id'] = probe_id
    if probe_shank is not None:
        query['probe_shank'] = probe_shank
    if region_id is not None:
        query['region_id'] = region_id
    if x is not None:
        query['x'] = x
    if x_warped is not None:
        query['x_warped'] = x_warped
    if y is not None:
        query['y'] = y
    if y_warped is not None:
        query['y_warped'] = y_warped
    if z is not None:
        query['z'] = z
    if z_warped is not None:
        query['z_warped'] = z_warped
    
    # return a generator object that yields Electrode objects
    i = 0
    for key in (sgc.Electrode & query):
        if limit is not None and i >= limit:
            break
        yield Electrode(key)
        i += 1