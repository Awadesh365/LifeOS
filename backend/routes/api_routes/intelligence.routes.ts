import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { models } from "../../models/index.js";
import * as service from "../../services/intelligence/service.js";
import {
  DEFINITIONS,
  EVENT_SCHEMAS,
  AGENT_CONTRACTS,
} from "../../services/intelligence/contracts.js";
const router = Router();
router.use((req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
  ) {
    res.status(400).json({ error: "A JSON object is required" });
    return;
  }
  next();
});
const run =
  (fn: (req: Request) => Promise<unknown> | unknown) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req))
      .then((data) => res.json(data))
      .catch(next);
  };
const owner = (r: Request) => r.session.userId!;
const id = (r: Request) => String(r.params.id);
const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await models.User.findByPk(owner(req));
    if (user?.get("role") !== "admin") {
      res.status(403).json({ error: "Administrator access required" });
      return;
    }
    next();
  } catch (e) {
    next(e);
  }
};
router.get(
  "/summary",
  run((r) => service.summary(owner(r))),
);
router.get(
  "/consents",
  run((r) => service.consents(owner(r))),
);
router.put(
  "/consents",
  run((r) => service.setConsent(owner(r), r.body)),
);
router.post(
  "/sources/import",
  run((r) => service.importSources(owner(r))),
);
router.post(
  "/sources/projection",
  run((r) => service.sourceProjection(owner(r), r.body)),
);
router.get(
  "/definitions",
  run(() => DEFINITIONS),
);
router.get(
  "/schemas",
  run(() => EVENT_SCHEMAS),
);
router.get(
  "/agent-contracts",
  run(() => AGENT_CONTRACTS),
);
router.get(
  "/artifacts",
  run((r) => service.listArtifacts(owner(r), r.query)),
);
router.get(
  "/artifacts/:id",
  run((r) => service.getArtifact(owner(r), id(r))),
);
router.post(
  "/artifacts/:id/feedback",
  run((r) => service.feedback(owner(r), id(r), r.body)),
);
router.post(
  "/artifacts/:id/outcome",
  run((r) => service.resolveOutcome(owner(r), id(r), r.body)),
);
router.post(
  "/projections",
  run((r) => service.createProjection(owner(r), r.body)),
);
router.post(
  "/predictions",
  run((r) => service.predict(owner(r), r.body)),
);
router.post(
  "/recommendations",
  run((r) => service.recommend(owner(r), r.body)),
);
router.get(
  "/models",
  run((r) => service.versions(owner(r))),
);
router.get(
  "/preferences",
  run((r) => service.preferences(owner(r))),
);
router.put(
  "/preferences",
  run((r) => service.preferences(owner(r), r.body)),
);
router.get(
  "/export",
  run((r) => service.exportData(owner(r))),
);
router.delete(
  "/data",
  run((r) => service.deleteData(owner(r), r.body)),
);
router.get(
  "/capabilities",
  run(async (r) => ({
    admin: (await models.User.findByPk(owner(r)))?.get("role") === "admin",
  })),
);
router.use(admin);
router.get(
  "/diagnostics",
  run((r) => service.diagnostics(owner(r))),
);
router.get(
  "/events",
  run((r) => service.events(owner(r))),
);
router.post(
  "/events",
  run((r) => service.ingest(owner(r), r.body)),
);
router.post(
  "/models/train",
  run((r) => service.train(owner(r), r.body)),
);
router.post(
  "/models/:id/stage",
  run((r) => service.transition(owner(r), id(r), r.body)),
);
export default router;
