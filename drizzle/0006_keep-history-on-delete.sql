ALTER TABLE "categories" DROP CONSTRAINT "categories_created_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_employee_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "employee_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_employee_id_profiles_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;