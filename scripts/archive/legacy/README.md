# Legacy scripts — do not run

These scripts are preserved for historical reference only. They were one-shot migration
and maintenance tools written during earlier phases of the site's development and are
no longer maintained or safe to run as-is.

**Do not invoke these scripts** without first reading them carefully and verifying that
every path, dependency, and assumption still holds. Several of them contain hardcoded
absolute paths, resolve content directories relative to the script file (not the repo
root), or would mutate or delete files if run without caution.

For current tooling, see [`scripts/README.md`](../../README.md).
