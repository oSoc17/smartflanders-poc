import { Util } from 'n3';
import Measurement from './../../models/measurement';
import Triple from './../../models/triple';
import {find} from 'lodash';
import * as moment from 'moment';

export class TriplesToMeasurements {
  private measurements = [];
  public previous: string;
  constructor() {}

  public getMeasurements(triples: Array < Triple > , parkingUri: string): Array < Measurement > {
    const _measurements: Array < Measurement > = [];
    const parkingTriples = [];
    const graphs = [];
    for (let index = 0; index < triples.length; index++) {
      if (triples[index].predicate === 'http://vocab.datex.org/terms#parkingNumberOfVacantSpaces' &&
        triples[index].subject === parkingUri) {
        parkingTriples.push(triples[index]);
      }
      if (triples[index].predicate === 'http://www.w3.org/ns/prov#generatedAtTime' && triples[index].graph === '') {
        graphs.push(triples[index]);
      }
    if (triples[index].predicate === 'http://www.w3.org/ns/hydra/core#previous') {
        this.previous = triples[index].object;
     }
    }
    for (let index = 0; index < parkingTriples.length; index++) {
      const graphTriple = find(graphs, (o) => {
        return parkingTriples[index].graph === o.subject
      });
      _measurements.push(new Measurement(moment(graphTriple.object.substring(1, 26)).unix(),
        Util.getLiteralValue(parkingTriples[index].object), parkingUri));
    }
    return _measurements.sort(this.compare);
  }
  private compare(a, b) {
    if (a.timestamp < b.timestamp) {return 1;
    }
    if (a.timestamp > b.timestamp) {return -1;
    }
      return 0;
    }
  }

