import { Address, BeneficialOwner, BusinessContact, FullName, Officer, Phone, State } from "./core"

export type ApplicationStatus =
    "AwaitingDocuments" | //Certain documents are required for the process to continue. You may upload them via Upload Document.
    "PendingReview" |     //The application is pending review by Unit.
    "Pending" |           //The application is being evaluated asynchronously and a result should be available shortly. Listen for webhooks (application.denied, customer.created and application.awaitingdocuments) for the final result, or periodically query the application with Get by Id).
    "Approved" |          //The application was approved. A Customer resource was created.
    "Denied"              //The application was denied. A Customer resource will not be created.

/**
 * More about [Relationship](https://developers.unit.co/#relationships)
 */
export type Relationship = null | [] | { type: string, id: string } | Array<{ type: string, id: string }>

export interface Application {
    /**
     * Identifier of the application resource.
     */
    id: string,

    /**
     * Type of the application resource.
     */
    type: string

    /**
     * The relationships object describes the relationship between the current resource and other resources.
     * Each member of the relationships object represents one reference.
     */
    relationships: {
        /**
         * Application's documents.
         */
        documents: Relationship

        /**
         * Optional. The created Customer in case of approved application.
         */
        customer?: Relationship
    }
}

export interface IndividualApplication extends Application {
    type: 'IndividualApplication',

    attributes: {
        /**
         * One of AwaitingDocuments, PendingReview, Pending, Approved or Denied, see Application Statuses.
         */
        status: ApplicationStatus

        /**
         * A message describing the IndividualApplication status.
         */
        message: string

        /**
         * Date only. The date the resource was created.
         * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
         */
        createdAt: string

        /**
         * SSN of the individual (numbers only). Either an SSN or a passport number is required.
         */
        ssn?: string

        /**
         * Passport number of the individual. Either an SSN or a passport is required.
         */
        passport?: string

        /**
         * Required on passport only. Two letters representing the individual nationality.
         * ISO31661 - Alpha2 format. For more information: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
         */
        nationality: string

        /**
         * Full name of the individual.
         */
        fullName: FullName

        /**
         * Date only.
         * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
         */
        dateOfBirth: string

        /**
         * Address of the individual.
         */
        address: Address

        /**
         * Phone of the individual.
         */
        phone: Phone

        /**
         * Email address of the individual.
         */
        email: string

        /**
         * IP address of the end-customer creating the application, if specified.
         */
        ip?: string

        /**
         * Optional. Indicates whether the individual is a sole proprietor, if specified.
         */
        soleProprietorship?: boolean

        /**
         * Optional. Indicates if the individual is a sole proprietor who has an Employer Identification Number, if specified.
         */
        ein?: string,

        /**
         * Optional. Indicates if the individual is a sole proprietor who is doing business under a different name, if specified.
         */
        dba?: string,

        /**
         * See [Tags](https://developers.unit.co/#tags).
         */
        tags: object
    }
}

export interface BusinessApplication extends Application {
    type: 'BusinessApplication',
    attributes: {
        /**
         * One of AwaitingDocuments, PendingReview, Approved, Pending, or Denied, see Application Statuses.
         */
        status: ApplicationStatus

        /**
         * A message describing the BusinessApplication status.
         */
        message: string

        /**
         * Date only. The date the resource was created.
         * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
         */
        createdAt: string

        /**
         * Name of the business.
         */
        name: string

        /**
         * Optional. “Doing business as”.
         */
        dba?: string

        /**
         * Address of the business.
         */
        address: Address

        /**
         * Phone of the business.
         */
        phone: Phone

        /**
         * Two letters representing a US state.
         */
        stateOfIncorporation: State

        /**
         * Business EIN (numbers only).
         */
        ein: string

        /**
         * One of "Corporation", "LLC" or "Partnership"
         */
        entityType: "Corporation" | "LLC" | "Partnership"

        /**
         * Primary contact of the business.
         */
        contact: BusinessContact

        /**
         * Officer representing the business, must be CEO, CFO, President or BenefitsAdministrationOfficer. The officer would need to go over KYC process and provide documents.
         */
        officer: Officer

        /**
         * Array of beneficial owners of the business. Beneficial Owner is anyone with more than 25% ownership. Beneficial Owners would need to go over KYC process and provide documents.
         */
        beneficialOwners: Array<BeneficialOwner>

        /**
         * See [Tags](https://developers.unit.co/#tags).
         */
        tags: Object

    }
}

export type ApplicationDocumentStatus =
    "Required" |	    //The document is required for the application to be evaluated.
    "ReceivedBack" |	//Back-side of the document was received. Front-side is still required. Only relevant for IdDocument document type.
    "ReceivedFront" |	//Front-side of the document was received. Back-side is still required. Only relevant for IdDocument document type.
    "Invalid" |	        //The document is invalid. You may re-upload the correct document for the application to be evaluated.
    "Approved" |	    //The document is approved.
    "PendingReview" 	//The document is currently undergoing review.


export type DocumentType =
    "IdDocument" |	        //An individual's Drivers License or State ID. Both front-side and back-side are required.
    "Passport" |	        //An individual's passport.
    "AddressVerification" |	//An individual's document to verify address. Document may be a utility bill, bank statement, lease agreement or current pay stub.
    "SocialSecurityCard" |	//An individual's social security card.
    "CertificateOfIncorporation" |	//A business's certificate of incorporation.
    "EmployerIdentificationNumberConfirmation" 	//A business's EIN confirmation document (either IRS form 147c or IRS form CP-575).

export type ReasonCode =
    "PoorQuality" |
    "NameMismatch" |
    "SSNMismatch" |
    "AddressMismatch" |
    "DOBMismatch" |
    "ExpiredId" |
    "EINMismatch" |
    "StateMismatch" |
    "Other"


export interface ApplicationDocument {
    /**
     * Identifier of the document resource.
     */
    id: string

    type: "document"

    /**
     * representing the document’s data.
     */
    attributes: {
        /**
         * One of Required, ReceivedBack, ReceivedFront, Invalid, Approved or PendingReview, see Application Document Status.
         */
        status: ApplicationDocumentStatus

        /**
         * One of IdDocument, Passport, AddressVerification, CertificateOfIncorporation or EmployerIdentificationNumberConfirmation.
         */
        documentType: DocumentType

        /**
         * The document requirements description.
         */
        description: string

        /**
         * Name of business or individual.
         */
        name: string

        /**
         * Individual address, present only for the AddressVerification document type.
         */
        address?: Address

        /**
         * Date only. Present only for Passport and License document types.
         * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
         */
        dateOfBirth?: string

        /**
         * Individual passport number. Present only for the Passport document type.
         */
        passport?: string

        /**
         * Business EIN. Present only for the EmployerIdentificationNumberConfirmation document type.
         */
        ein?: string

        /**
         * Application Document rejection reason code. Present only when document status is Invalid.
         * One of PoorQuality, NameMismatch, SSNMismatch, AddressMismatch, DOBMismatch, ExpiredId, EINMismatch, StateMismatch, Other.
         */
        reasonCode?: ReasonCode

        /**
         * Application Document rejection reason. Present only when document status is Invalid.
         */
        reason?: string
    }
}
