export type SGSession = {
    nwb_file_name: string
    subject_id: string
    institution_name: string
    lab_name: string
    session_id: string
    session_description: string
    session_start_time: number
    timestamps_reference_time: number
    experiment_description: string
}

export type SGSubject = {
    subject_id: string
    age: number
    description: string
    genotype: string
    sex: string
    species: string
}

export type SGElectrodeGroup = {
    electrode_group_name: string
    description: string
    nwb_file_name: string
    probe_id: string
    region_id: string
    target_hemisphere: string
}

export type SGIntervalList = {
    nwb_file_name: string
    interval_list_name: string
    valid_times: ([number, number])[]
}