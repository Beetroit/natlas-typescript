## 2025-05-18 - Avoid unnecessary object copying in array transformations
**Learning:** In hot path functions like dialect guard processing, unrolling array mapping and avoiding shallow copying every untouched object (`{ ...msg }`) yields a ~5x speedup and significantly reduces GC allocation pressure.
**Action:** Reuse object references for unmodified array elements when building modified message arrays in high-frequency SDK methods.
