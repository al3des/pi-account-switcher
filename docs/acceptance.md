# Pi 1.0.2 Docker acceptance

Run `npm run test:acceptance` from the checkout with Docker available.

The image uses Node 22.16.0 and the committed npm lockfile, including exact Pi 1.0.2 development dependencies. The build fetches dependencies. Acceptance then runs with `--network none`, dropped capabilities, and no host mounts (including no HOME, credentials, or Docker socket). HOME and `PI_CODING_AGENT_DIR` point to disposable synthetic directories. Only source, manifests, and test configuration are copied into the image; developer environment variables are not forwarded.

The offline command performs normal `pi install /work` local-package installation, discovers it through saved package settings using Pi's actual resource loader, asserts exact host version and one loaded extension with zero errors/warnings, then runs typecheck and all tests. Credential tests use synthetic API keys and OAuth-shaped entries against actual Pi APIs with model network discovery disabled. They make no provider requests and do not test OAuth refresh or validity.

For subsequent tickets, add durable regressions under `src/**/*.test.ts`; they automatically run here. A custom offline command can also be supplied, for example:

```sh
bash scripts/acceptance/run.sh sh -ec 'npm test -- src/utils/accounts.test.ts'
```

Custom commands replace the default installation/loading/typecheck suite. No runtime mounts are added. The temporary image is removed on exit and the acceptance container is disposable. Dependency fetching requires network; acceptance does not. Keep future tests synthetic and avoid provider requests even though the container blocks external networking.

Wildcard peers are Pi's host-package declaration contract, not a support range. Only Pi 1.0.2 is validated. Extension-owned jiti and zod remain runtime dependencies.
