CREATE TABLE "staff_access_code" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"hash" text NOT NULL,
	"salt" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_access_code" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "staff_access_code" ADD CONSTRAINT "staff_access_code_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;