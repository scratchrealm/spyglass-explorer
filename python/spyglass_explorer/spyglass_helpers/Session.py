from typing import Optional
import spyglass.common as sgc


class Session:
    def __init__(self, key: dict):
        self.key = key
        self.experiment_description: str = key['experiment_description']
        self.institution_name: str = key['institution_name']
        self.lab_name: str = key['lab_name']
        self.nwb_file_name: str = key['nwb_file_name']
        self.session_description: str = key['session_description']
        self.session_id: str = key['session_id']
        self.session_start_time: float = key['session_start_time']
        self.subject_id: str = key['subject_id']
        self.timestamps_reference_time: float = key['timestamps_reference_time']
    def __str__(self) -> str:
        return f"Session({self.key})"

def fetch_sessions(*,
    limit: Optional[int] = None,
    experiment_description: Optional[str] = None,
    institution_name: Optional[str] = None,
    lab_name: Optional[str] = None,
    nwb_file_name: Optional[str] = None,
    session_description: Optional[str] = None,
    session_id: Optional[str] = None,
    session_start_time_min: Optional[float] = None,
    session_start_time_max: Optional[float] = None,
    subject_id: Optional[str] = None,
    timestamps_reference_time_min: Optional[float] = None,
    timestamps_reference_time_max: Optional[float] = None
):
    query = {}
    if experiment_description is not None:
        query['experiment_description'] = experiment_description
    if institution_name is not None:
        query['institution_name'] = institution_name
    if lab_name is not None:
        query['lab_name'] = lab_name
    if nwb_file_name is not None:
        query['nwb_file_name'] = nwb_file_name
    if session_description is not None:
        query['session_description'] = session_description
    if session_id is not None:
        query['session_id'] = session_id
    if session_start_time_min is not None:
        raise Exception('Not working yet')
        # query['session_start_time >='] = session_start_time_min.timestamp()
    if session_start_time_max is not None:
        raise Exception('Not working yet')
        # query['session_start_time <='] = session_start_time_max.timestamp()
    if subject_id is not None:
        query['subject_id'] = subject_id
    if timestamps_reference_time_min is not None:
        raise Exception('Not working yet')
        # query['timestamps_reference_time >='] = timestamps_reference_time_min
    if timestamps_reference_time_max is not None:
        raise Exception('Not working yet')
        # query['timestamps_reference_time <='] = timestamps_reference_time_max
    
    # return a generator object that yields Session objects
    i = 0
    for key in (sgc.Session & query):
        if limit is not None and i >= limit:
            break
        yield Session(key)
        i += 1