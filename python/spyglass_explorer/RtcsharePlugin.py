from typing import Tuple, Union
import datetime
from .spyglass_helpers import fetch_sessions, fetch_subjects, fetch_electrode_groups, fetch_interval_lists
import threading
import numpy as np


class RtcsharePlugin:
    def initialize(context):
        context.register_service('spyglass-explorer', SpyglassExplorerService)

# The lock is needed because datajoint database access is not thread-safe
lock = threading.Lock()

class SpyglassExplorerService:
    def handle_query(query: dict, *, dir: str, user_id: Union[str, None]=None) -> Tuple[dict, bytes]:
        # todo: authenticate user
        type0 = query['type']
        if type0 == 'get_subjects':
            with lock:
                a = fetch_subjects(
                    limit = query['limit'],
                    subject_id=query.get('subject_id', None),
                    age=query.get('age', None),
                    description=query.get('description', None),
                    genotype=query.get('genotype', None),
                    sex=query.get('sex', None),
                    species=query.get('species', None)
                )
                subjects = []
                for s in a:
                    subjects.append(s.key)
                return convert_to_json_serializable({'subjects': subjects}), b''
        elif type0 == 'get_sessions':
            with lock:
                a = fetch_sessions(
                    limit=query['limit'] + 1, # include one more so we can tell if there are additional sessions
                    session_id=query.get('session_id', None),
                    subject_id=query.get('subject_id', None),
                    experiment_description=query.get('experiment_description', None),
                    institution_name=query.get('institution_name', None),
                    lab_name=query.get('lab_name', None),
                    nwb_file_name=query.get('nwb_file_name', None),
                    session_description=query.get('session_description', None),
                    # session_start_time_min=query.get('session_start_time_min', None),
                    # session_start_time_max=query.get('session_start_time_max', None),
                    # timestamps_reference_time_min=query.get('timestamps_reference_time_min', None),
                    # timestamps_reference_time_max=query.get('timestamps_reference_time_max', None)
                )
                sessions = []
                has_more = False
                for s in a:
                    if len(sessions) >= query['limit']:
                        has_more = True
                        break
                    sessions.append(s.key)
                return convert_to_json_serializable({'sessions': sessions, 'has_more': has_more}), b''
        elif type0 == 'get_electrode_groups':
            with lock:
                a = fetch_electrode_groups(
                    limit=query['limit'] + 1, # include one more so we can tell if there are additional electrode groups
                    nwb_file_name=query['nwb_file_name']
                )
                electrode_groups = []
                has_more = False
                for eg in a:
                    if len(electrode_groups) >= query['limit']:
                        has_more = True
                        break
                    electrode_groups.append(eg.key)
                return convert_to_json_serializable({'electrode_groups': electrode_groups, 'has_more': has_more}), b''
        elif type0 == 'get_interval_lists':
            with lock:
                a = fetch_interval_lists(
                    limit=query['limit'] + 1, # include one more so we can tell if there are additional interval lists
                    nwb_file_name=query['nwb_file_name']
                )
                interval_lists = []
                has_more = False
                for il in a:
                    if len(interval_lists) >= query['limit']:
                        has_more = True
                        break
                    interval_lists.append(il.key)
                return convert_to_json_serializable({'interval_lists': interval_lists, 'has_more': has_more}), b''
        else:
            raise Exception(f'Unexpected query type: {type0}')

def convert_to_json_serializable(obj):
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.timestamp()
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        ret = {}
        for key, val in obj.items():
            ret[key] = convert_to_json_serializable(val)
        return ret
    elif isinstance(obj, list):
        ret = []
        for val in obj:
            ret.append(convert_to_json_serializable(val))
        return ret
    else:
        return obj
