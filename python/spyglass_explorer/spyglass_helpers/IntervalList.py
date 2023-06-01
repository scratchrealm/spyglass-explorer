from typing import Optional
import spyglass.common as sgc
from .Session import Session


class IntervalList:
    def __init__(self, key: dict):
        self.key = key
        self.interval_list_name: str = key['interval_list_name']
        self.nwb_file_name: str = key['nwb_file_name']
        self.valid_times = key['valid_times']

def fetch_interval_lists(*,
    limit: Optional[int] = None,
    session: Optional[Session] = None,
    interval_list_name: Optional[str] = None,
    nwb_file_name: Optional[str] = None
):
    query = {}
    if session is not None:
        for k in session.key:
            query[k] = session.key[k]
    if interval_list_name is not None:
        query['interval_list_name'] = interval_list_name
    if nwb_file_name is not None:
        query['nwb_file_name'] = nwb_file_name
    
    # return a generator object that yields IntervalList objects
    i = 0
    for key in (sgc.IntervalList & query):
        if limit is not None and i >= limit:
            break
        yield IntervalList(key)
        i += 1
