import { VerifiableCredentialService } from "@quarkid/vc-core";
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
import { FileSystemKMSSecureStorage } from "./storage";
import { AssertionMethodPurpose } from "@quarkid/did-core";
import { universalResolver } from "./did";
import { VCVerifierService } from "@quarkid/vc-verifier";

// FIXME: Put your DID here!
const issuerDid = 'did:quarkid:zksync:EiCJ-UKxLNBgK1oPMDnTE24tADs5RdPOgpBqoIruHry3DQ';

const credential = async () => {
  const vcService = new VerifiableCredentialService();

  const credential = await vcService.createCredential({
    context: [
      "https://w3id.org/vaccination/v1",
      "https://w3id.org/security/v2",
      "https://w3id.org/security/bbs/v1",
    ],
    vcInfo: {
      issuer: issuerDid,
      expirationDate: new Date("2026/05/05"),
      id: "123456789",
      types: ["VaccinationCertificate"],
    },
    data: {
      type: "VaccinationEvent",
      batchNumber: "1183738569",
      administeringCentre: "MoH",
      healthProfessional: "MoH",
      countryOfVaccination: "NZ",
      recipient: {
        type: "VaccineRecipient",
        givenName: "JOHN",
        familyName: "SMITH",
        gender: "Male",
        birthDate: "1958-07-17",
      },
      vaccine: {
        type: "Vaccine",
        disease: "COVID-19",
        atcCode: "J07BX03",
        medicinalProductName: "COVID-19 Vaccine Moderna",
        marketingAuthorizationHolder: "Moderna Biotech",
      },
    },
    mappingRules: null,
  });

  console.log("Credential", credential);
  const kms = new KMSClient({
    lang: LANG.es,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage.json",
    }),
    didResolver: universalResolver.resolveDID
  });

  const bbsbls2020 = await kms.getPublicKeysBySuiteType(Suite.Bbsbls2020);
  const vc = await kms.signVC(
    Suite.Bbsbls2020,
    bbsbls2020[0],
    credential,
    issuerDid,
    `${issuerDid}#bbsbls`,
    new AssertionMethodPurpose()
  );
  console.log("Verifiable Credential Signed", vc);

  const service = new VCVerifierService({
    didDocumentResolver: async (did: string) => {

      const didDocument = await universalResolver.resolveDID(did);

      return didDocument;
    },
  });
  const result = await service.verify(vc, new AssertionMethodPurpose());
  console.log("Verification result:", result);
  return;
};

credential();
