from typing import Optional
import spyglass.common as sgc
from .Session import Session


class Probe:
    def __init__(self, key: dict):
        self.key = key
        self.contact_side_numbering: str = key['contact_side_numbering']
        self.data_acquisition_device_name: str = key['data_acquisition_device_name']
        self.probe_id: str = key['probe_id']
        self.probe_type: str = key['probe_type']
    def __str__(self) -> str:
        return f"Probe({self.key})"
    # def get_electrodes_by_

def fetch_probes(*,
    limit: Optional[int] = None,
    session: Session,
    contact_side_numbering: Optional[str] = None,
    data_acquisition_device_name: Optional[str] = None,
    probe_id: Optional[str] = None,
    probe_type: Optional[str] = None
):
    query = {}
    if session is not None:
        for k in session.key:
            query[k] = session.key[k]
    if contact_side_numbering is not None:
        query['contact_side_numbering'] = contact_side_numbering
    if data_acquisition_device_name is not None:
        query['data_acquisition_device_name'] = data_acquisition_device_name
    if probe_id is not None:
        query['probe_id'] = probe_id
    if probe_type is not None:
        query['probe_type'] = probe_type
    
    # return a generator object that yields Probe objects
    i = 0
    for key in (sgc.Probe & query):
        if limit is not None and i >= limit:
            break
        yield Probe(key)
        i += 1