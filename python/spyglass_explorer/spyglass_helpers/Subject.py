from typing import Optional
import spyglass.common as sgc


class Subject:
    def __init__(self, key: dict):
        self.key = key
        self.subject_id: str = key['subject_id']
        self.age: Optional[float] = key['age']
        self.description: str = key['description']
        self.genotype: str = key['genotype']
        self.sex = key['sex']
        self.species = key['species']        
    def __str__(self) -> str:
        return f"Subject({self.key})"

def fetch_subjects(*,
    limit: Optional[int] = None,
    subject_id: Optional[str] = None,
    age: Optional[float] = None,
    description: Optional[str] = None,
    genotype: Optional[str] = None,
    sex: Optional[str] = None,
    species: Optional[str] = None
):
    query = {}
    if subject_id is not None:
        query['subject_id'] = subject_id
    if age is not None:
        query['age'] = age
    if description is not None:
        query['description'] = description
    if genotype is not None:
        query['genotype'] = genotype
    if sex is not None:
        query['sex'] = sex
    if species is not None:
        query['species'] = species
    
    # return a generator object that yields Subject objects
    i = 0
    for key in (sgc.Subject & query):
        if limit is not None and i >= limit:
            break
        yield Subject(key)
        i += 1