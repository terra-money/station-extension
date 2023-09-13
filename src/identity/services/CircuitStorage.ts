import {
  CircuitId,
  CircuitStorage,
  IndexedDBDataSource,
} from "@0xpolygonid/js-sdk"

export class CircuitStorageInstance {
  static instanceCS: CircuitStorage | undefined = undefined

  static async init() {
    if (!this.instanceCS) {
      this.instanceCS = new CircuitStorage(new IndexedDBDataSource("circuits"))
      try {
        // console.time("check loading circuits from DB");
        // const data = await this.instanceCS.loadCircuitData(CircuitId.AuthV2);
        // console.log(data);
        // console.timeEnd("check loading circuits from DB");
        const auth_w = await fetch("./AuthV2/circuit.wasm")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const auth_z = await fetch("./AuthV2/circuit_final.zkey")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const auth_j = await fetch("./AuthV2/verification_key.json")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))

        await this.instanceCS.saveCircuitData(CircuitId.AuthV2, {
          circuitId: "authV2".toString(),
          wasm: auth_w,
          provingKey: auth_z,
          verificationKey: auth_j,
        })
        return this.instanceCS
      } catch (e) {
        console.time("CircuitStorageInstance.init")
        const auth_w = await fetch("./AuthV2/circuit.wasm")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const mtp_w = await fetch("./credentialAtomicQueryMTPV2/circuit.wasm")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const sig_w = await fetch("./credentialAtomicQuerySigV2/circuit.wasm")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))

        const auth_z = await fetch("./AuthV2/circuit_final.zkey")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const mtp_z = await fetch(
          "./credentialAtomicQueryMTPV2/circuit_final.zkey"
        )
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const sig_z = await fetch(
          "./credentialAtomicQuerySigV2/circuit_final.zkey"
        )
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))

        const auth_j = await fetch("./AuthV2/verification_key.json")
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const mtp_j = await fetch(
          "./credentialAtomicQueryMTPV2/verification_key.json"
        )
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        const sig_j = await fetch(
          "./credentialAtomicQuerySigV2/verification_key.json"
        )
          .then((response) => response.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer))
        console.timeEnd("CircuitStorageInstance.init")
        // this.instanceCS = new CircuitStorage(new InMemoryDataSource());
        console.time("CircuitStorageInstance.saveCircuitData")
        await this.instanceCS.saveCircuitData(CircuitId.AuthV2, {
          circuitId: "authV2".toString(),
          wasm: auth_w,
          provingKey: auth_z,
          verificationKey: auth_j,
        })
        await this.instanceCS.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
          circuitId: "credentialAtomicQueryMTPV2".toString(),
          wasm: mtp_w,
          provingKey: mtp_z,
          verificationKey: mtp_j,
        })
        await this.instanceCS.saveCircuitData(CircuitId.AtomicQuerySigV2, {
          circuitId: "credentialAtomicQuerySigV2".toString(),
          wasm: sig_w,
          provingKey: sig_z,
          verificationKey: sig_j,
        })
        console.timeEnd("CircuitStorageInstance.saveCircuitData")
      }
    }
  }

  static getCircuitStorageInstance() {
    return this.instanceCS
  }
}
