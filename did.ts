import { FileSystemKMSSecureStorage } from "./storage";
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
import { ModenaUniversalRegistry } from "@quarkid/did-registry";
import { AssertionMethodPurpose, KeyAgreementPurpose } from "@quarkid/did-core";
import { DIDUniversalResolver } from "@quarkid/did-resolver";
import { DIDDocument } from "@extrimian/did-core";

// export const resolverUrl = "https://node-ssi.buenosaires.gob.ar"; // Quark ID resolver URL
export const resolverUrl = "https://demo.extrimian.com/sidetree-proxy"; // Extrimian demo resolver URL
export const universalResolver = new DIDUniversalResolver({
  universalResolverURL: resolverUrl,
});

export const resolveDid = (did: string) =>
  new Promise<DIDDocument>((resolve, reject) => {
    setTimeout(async () => {

      const didDocument = await universalResolver.resolveDID(did);
      console.log("Resolved DID Document: ", JSON.stringify(didDocument, null, 2));
      console.log("Don't forget to copy your DID for the next stage! Here it is:", didDocument.id)
      return didDocument;
    }, 65000);
  });

export const createDID = async () => {
  const kms = new KMSClient({
    lang: LANG.en,
    didResolver: universalResolver.resolveDID,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage.json",
    }),
  });

  const registry = new ModenaUniversalRegistry();

  const updateKey = await kms.create(Suite.ES256k);
  const recoveryKey = await kms.create(Suite.ES256k);

  const didComm = await kms.create(Suite.DIDComm);
  const bbsbls = await kms.create(Suite.Bbsbls2020);


  const createDidResponse = await registry.createDID({
    updateKeys: [updateKey.publicKeyJWK],
    recoveryKeys: [recoveryKey.publicKeyJWK],
    verificationMethods: [
      {
        id: "bbsbls",
        type: "Bls12381G1Key2020",
        publicKeyJwk: bbsbls.publicKeyJWK,
        purpose: [new AssertionMethodPurpose()],
      },
      {
        id: "didComm",
        type: "X25519KeyAgreementKey2019",
        publicKeyJwk: didComm.publicKeyJWK,
        purpose: [new KeyAgreementPurpose()],
      },
    ],
    services: [{
      id: "dwn-default",
      type: "DecentralizedWebNode",
      serviceEndpoint: {
        nodes: [
          "https://demo.extrimian.com/dwn/"
        ],
      }
    }],
  });

  const didPublication = await registry.publishDID({
    universalResolverURL: resolverUrl,
    didMethod: "did:quarkid:zksync",
    createDIDResponse: createDidResponse,
  });

  console.log("DID Published", didPublication);
  const didDocument = await resolveDid(didPublication.did);
};

createDID();
