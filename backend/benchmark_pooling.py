"""
Performance Comparison: Connection Pooling vs. Individual Connections

This script demonstrates the performance improvement from using connection pooling.
"""

import time
import mysql.connector
from db_conn import get_db_connection, DB_CONFIG, initialize_pool

def test_without_pool(iterations=10):
    """Test performance without connection pooling"""
    print("\n" + "="*60)
    print("TEST 1: WITHOUT CONNECTION POOLING")
    print("="*60)
    
    start_time = time.time()
    
    for i in range(iterations):
        # Create new connection each time (slow)
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            ssl_ca=DB_CONFIG.get('ssl_ca'),
            ssl_disabled=False
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE(), CONNECTION_ID()")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if (i + 1) % 5 == 0:
            print(f"  Completed {i + 1}/{iterations} queries...")
    
    elapsed = time.time() - start_time
    avg_time = (elapsed / iterations) * 1000  # Convert to ms
    
    print(f"\n📊 Results:")
    print(f"  Total time: {elapsed:.3f} seconds")
    print(f"  Average per query: {avg_time:.2f} ms")
    
    return elapsed, avg_time


def test_with_pool(iterations=10):
    """Test performance with connection pooling"""
    print("\n" + "="*60)
    print("TEST 2: WITH CONNECTION POOLING")
    print("="*60)
    
    # Initialize pool once
    initialize_pool()
    
    start_time = time.time()
    
    for i in range(iterations):
        # Get connection from pool (fast)
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DATABASE(), CONNECTION_ID()")
            result = cursor.fetchone()
            cursor.close()
        
        if (i + 1) % 5 == 0:
            print(f"  Completed {i + 1}/{iterations} queries...")
    
    elapsed = time.time() - start_time
    avg_time = (elapsed / iterations) * 1000  # Convert to ms
    
    print(f"\n📊 Results:")
    print(f"  Total time: {elapsed:.3f} seconds")
    print(f"  Average per query: {avg_time:.2f} ms")
    
    return elapsed, avg_time


def main():
    print("\n" + "🚀 " + "="*56)
    print("DATABASE CONNECTION POOLING - PERFORMANCE BENCHMARK")
    print("="*60)
    
    iterations = 20
    print(f"\nRunning {iterations} database queries for each test...\n")
    
    # Test without pooling
    try:
        time_no_pool, avg_no_pool = test_without_pool(iterations)
    except Exception as e:
        print(f"\n❌ Test without pool failed: {e}")
        print("Continuing with pooled test...")
        time_no_pool, avg_no_pool = 0, 0
    
    # Wait a moment between tests
    time.sleep(1)
    
    # Test with pooling
    time_with_pool, avg_with_pool = test_with_pool(iterations)
    
    # Calculate improvement
    print("\n" + "="*60)
    print("📈 PERFORMANCE COMPARISON")
    print("="*60)
    
    if time_no_pool > 0:
        improvement = (time_no_pool - time_with_pool) / time_no_pool * 100
        speedup = time_no_pool / time_with_pool if time_with_pool > 0 else 0
        
        print(f"\nWithout Pooling:")
        print(f"  ⏱️  Total: {time_no_pool:.3f}s | Average: {avg_no_pool:.2f}ms per query")
        
        print(f"\nWith Pooling:")
        print(f"  ⚡ Total: {time_with_pool:.3f}s | Average: {avg_with_pool:.2f}ms per query")
        
        print(f"\n🎯 Improvement:")
        print(f"  ⬆️  Speed increase: {speedup:.1f}x faster")
        print(f"  📉 Time saved: {improvement:.1f}%")
        print(f"  ⏰ Saved {time_no_pool - time_with_pool:.3f} seconds total")
    else:
        print(f"\nWith Pooling:")
        print(f"  ⚡ Total: {time_with_pool:.3f}s | Average: {avg_with_pool:.2f}ms per query")
    
    print("\n" + "="*60)
    print("✅ Benchmark Complete!")
    print("="*60)
    
    # Recommendations
    print("\n💡 Recommendations:")
    print("  • Use connection pooling for all production code")
    print("  • Set DB_POOL_SIZE based on your concurrent user count")
    print("  • Monitor pool status during peak traffic")
    print("  • Typical pool size: 10-20 connections for most apps")
    
    print("\n📚 Next Steps:")
    print("  • Read DB_POOLING_GUIDE.md for detailed documentation")
    print("  • Check example_pool_usage.py for code patterns")
    print("  • Update your API endpoints to use pooling")
    
    print()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Benchmark interrupted by user")
    except Exception as e:
        print(f"\n❌ Benchmark failed: {e}")
        import traceback
        traceback.print_exc()
