if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/prasanth/.gradle/caches/8.14.1/transforms/1dc611b6bcc8aae3b32d018a69c02df2/transformed/hermes-android-0.80.3-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/prasanth/.gradle/caches/8.14.1/transforms/1dc611b6bcc8aae3b32d018a69c02df2/transformed/hermes-android-0.80.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

