import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { CreateExpenseSchema, GetExpenseSchema, GetExpensesSchema } from '../dtos/expense.dtos';

export function createExpenseRouter(controller: ExpenseController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetExpensesSchema),
        handleAsync((req, res) => controller.getExpenses(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetExpenseSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateExpenseSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    return router;
}
