# quarkid-docs-demo
Demonstration of the components listed in the Quark ID documentation. This demo's purpose is to showcase the basic components of the solution: 
- Creating, publishing and resolving a DID Document 
- Signing and verifying an Verifiable credential

The demo is meant to be used in conjunction with the Quark ID official documentation' [Quickstart](https://docs.quarkid.org/Quickstart/), so be sure to read it beforehand.

## Prerequisites
- NodeJS v18
- ts-node v10.9.2

## Installation
Simply install the dependencies by running `npm install`

## Use
1. Publish your DID by running `ts-node did.ts`. This will create a DID Document with cryptographic key and service definitions. Don't forget to copy your DID for the next stage!
2. Replace the `issuerDid` field at the top of `credentials.ts` with the newly generated DID.
3. Sign and verify a Verifiable Credential by running `ts-node credentials.ts`
4. You may check out an example WACI issuance exchange and an issued VC in `waci-examples/waci-storage.json` and `waci-examples/vc-storage.json`

Note: Be sure to check out the source code and logs for each command to better understand the SSI primitives at play.

## Further reading
If you want to learn more about the protocol specifications being implemented here, be sure to check out the Decentralised Identity Foundation's specifications. Here are some important ones to get you started:
- [Decentalised Identifiers (DIDs)](https://w3c.github.io/did-core/)
- [WACI-DIDComm Interop Profile (how credentials are issued and verified)](https://identity.foundation/waci-didcomm/)
- [Sidetree (how DIDs are registered and resolved)](https://identity.foundation/sidetree/spec/)
