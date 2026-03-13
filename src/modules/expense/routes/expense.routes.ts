import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { CreateExpenseSchema, GetExpenseSchema, GetExpensesSchema } from '../dtos/expense.dtos';

export function createExpenseRouter(controller: ExpenseController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetExpensesSchema),
        (req, res) => controller.getExpenses(req, res)
    );
    router.get(
        '/:id',
        validateRequest(GetExpenseSchema),
        (req, res) => controller.getById(req, res)
    );
    router.post(
        '/',
        validateRequest(CreateExpenseSchema),
        (req, res) => controller.create(req, res)
    );
    return router;
}
