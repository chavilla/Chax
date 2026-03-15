import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { getOrganizationIdFromRequest } from '../../../shared/auth/getAuthContext';
import { GetDianLogUseCase } from '../useCases/GetDianLogUseCase';
import { GetDianLogsByInvoiceUseCase } from '../useCases/GetDianLogsByInvoiceUseCase';
import { GetDianLogsByOrganizationUseCase } from '../useCases/GetDianLogsByOrganizationUseCase';

function toResponse(log: {
    id: string;
    props: {
        action: string;
        requestXml?: string | null;
        responseXml?: string | null;
        statusCode?: number | null;
        dianResponseCode?: string | null;
        success: boolean;
        errorMessage?: string | null;
        invoiceId: string;
        createdAt?: Date;
    };
}) {
    return {
        id: log.id,
        action: log.props.action,
        requestXml: log.props.requestXml ?? null,
        responseXml: log.props.responseXml ?? null,
        statusCode: log.props.statusCode ?? null,
        dianResponseCode: log.props.dianResponseCode ?? null,
        success: log.props.success,
        errorMessage: log.props.errorMessage ?? null,
        invoiceId: log.props.invoiceId,
        createdAt: log.props.createdAt?.toISOString() ?? null,
    };
}

/** Respuesta resumida (sin XML) para listados. */
function toSummaryResponse(log: {
    id: string;
    props: {
        action: string;
        statusCode?: number | null;
        dianResponseCode?: string | null;
        success: boolean;
        errorMessage?: string | null;
        invoiceId: string;
        createdAt?: Date;
    };
}) {
    return {
        id: log.id,
        action: log.props.action,
        statusCode: log.props.statusCode ?? null,
        dianResponseCode: log.props.dianResponseCode ?? null,
        success: log.props.success,
        errorMessage: log.props.errorMessage ?? null,
        invoiceId: log.props.invoiceId,
        createdAt: log.props.createdAt?.toISOString() ?? null,
    };
}

@injectable()
export class DianLogController {
    constructor(
        private readonly getDianLogUseCase: GetDianLogUseCase,
        private readonly getByInvoiceUseCase: GetDianLogsByInvoiceUseCase,
        private readonly getByOrganizationUseCase: GetDianLogsByOrganizationUseCase
    ) {}

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const log = await this.getDianLogUseCase.execute(id);
        return response.status(200).json(toResponse(log));
    }

    async getByInvoice(request: Request, response: Response): Promise<Response> {
        const invoiceId = request.query.invoiceId as string;
        const list = await this.getByInvoiceUseCase.execute(invoiceId);
        return response.status(200).json(list.map(toSummaryResponse));
    }

    async getByOrganization(
        request: Request,
        response: Response
    ): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const limit = request.query.limit
            ? Number(request.query.limit)
            : undefined;
        const list = await this.getByOrganizationUseCase.execute({
            organizationId,
            limit,
        });
        return response.status(200).json(list.map(toSummaryResponse));
    }
}
