/*
 * (c) 2016 Good Technology Corporation. All rights reserved.
 */

#pragma once

#include <sys/types.h>
#include <sys/socket.h>
#include <sys/select.h>

/** \addtogroup capilist
 * @{
 */

#ifdef __cplusplus
extern "C" {
#endif
    
#ifndef GD_C_API
#   if !defined(_WIN32)
#       define GD_C_API __attribute__((visibility("default")))
#   else
#       define GD_C_API
#   endif
#endif
    
    /** C API.
     */
    GD_C_API int GD_accept(int, struct sockaddr * __restrict addr, socklen_t * __restrict addrlen);

    /** C API.
     */
    GD_C_API int GD_bind(int, const struct sockaddr *, socklen_t);

    /** C API.
     */
    GD_C_API int GD_connect(int, const struct sockaddr *, socklen_t);

    /** C API.
     */
    GD_C_API int GD_getpeername(int, struct sockaddr * __restrict, socklen_t * __restrict);

    /** C API.
     */
    GD_C_API int GD_getsockname(int, struct sockaddr * __restrict, socklen_t * __restrict);

    /** C API.
     */
    GD_C_API int GD_getsockopt(int, int, int, void * __restrict, socklen_t * __restrict);

    /** C API.
     */
    GD_C_API int GD_listen(int, int);

    /** C API.
     */
    GD_C_API ssize_t GD_recv(int, void *, size_t, int);

    /** C API.
     */
    GD_C_API ssize_t GD_recvfrom(int, void *, size_t, int, struct sockaddr * __restrict, socklen_t * __restrict);

    /** C API.
     */
    GD_C_API ssize_t GD_recvmsg(int, struct msghdr *, int);

    /** C API.
     */
    GD_C_API ssize_t GD_send(int, const void *, size_t, int);

    /** C API.
     */
    GD_C_API ssize_t GD_sendmsg(int, const struct msghdr *, int);

    /** C API.
     */
    GD_C_API ssize_t GD_sendto(int, const void *, size_t, int, const struct sockaddr *, socklen_t);

    /** C API.
     */
    GD_C_API int GD_setsockopt(int, int, int, const void *, socklen_t);

    /** C API.
     */
    GD_C_API int GD_shutdown(int, int);

    /** C API.
     */
    GD_C_API int GD_sockatmark(int);

    /** C API.
     */
    GD_C_API int GD_socket(int, int, int);

    /** C API.
     */
    GD_C_API int GD_socketpair(int, int, int, int *);

    /** C API.
     */
    GD_C_API int GD_ioctlsocket(int, long, unsigned long*);

    /** C API.
     */
    GD_C_API int GD_gethostname(char* name, size_t len);

    /**
    */
    GD_C_API int GD_select(int, fd_set*, fd_set*, fd_set*, struct timeval*);

#ifdef __cplusplus
}
#endif

/** @}
 */
